import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './RMCalculator.module.scss';
import { EXERCISES_DB, MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

export const RMCalculator = () => {
  const { token } = useAuthStore();
  
  // Estados de Formulario
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  
  // Estado para errores (Objeto vacío inicialmente)
  const [errors, setErrors] = useState({});

  // Estados de Datos y Paginación
  const [results, setResults] = useState(null);
  const [savedRMs, setSavedRMs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const LIMIT = 5;

  const filteredExercises = useMemo(() => 
    EXERCISES_DB.filter(ex => ex.group === selectedGroup), 
  [selectedGroup]);

  const bestResultsByExercise = useMemo(() => {
    const mapping = {};
    savedRMs.forEach((rm) => {
      const currentMax = mapping[rm.exerciseName] || 0;
      if (rm.brzyckiResult > currentMax) {
        mapping[rm.exerciseName] = rm.brzyckiResult;
      }
    });
    return mapping;
  }, [savedRMs]);

  const fetchSavedRMs = useCallback(async (isNextPage = false) => {
    if (!token) return;
    isNextPage ? setLoadingMore(true) : setLoading(true);

    try {
      const currentPage = isNextPage ? page + 1 : 1;
      const response = await fetch(`${BASE_URL}/rm?page=${currentPage}&limit=${LIMIT}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        const newRecords = data.records || [];
        setSavedRMs(prev => isNextPage ? [...prev, ...newRecords] : newRecords);
        setHasNextPage(data.hasNextPage || false);
        setPage(currentPage);
      }
    } catch (error) { 
      toast.error("Error al cargar historial");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, page]);

  useEffect(() => {
    fetchSavedRMs(false);
  }, [token, fetchSavedRMs]);

  const calculateRM = (e) => {
    if(e) e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!selectedGroup) newErrors.muscleGroup = "Selecciona un grupo";
    if (!selectedExercise) newErrors.exerciseName = "Selecciona un ejercicio";
    if (!weight || parseFloat(weight) <= 0) newErrors.weightUsed = "Peso requerido";
    if (!reps || parseInt(reps) <= 0) newErrors.repsDone = "Reps requeridas";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return toast.error("Completa todos los campos 🏋️‍♂️");
    }
    
    const w = parseFloat(weight);
    const r = parseInt(reps);

    setResults({ 
      epley: (w * (1 + r / 30)).toFixed(1), 
      brzycki: (w / (1.0278 - 0.0278 * r)).toFixed(1) 
    });
    setIsCalculated(true);
  };

  const handleSaveRM = async () => {
    setErrors({});
    const payload = {
      exerciseName: selectedExercise,
      muscleGroup: selectedGroup,
      weightUsed: Number(weight),
      repsDone: Number(reps),
      epleyResult: Number(results?.epley),
      brzyckiResult: Number(results?.brzycki)
    };

    try {
      const res = await fetch(`${BASE_URL}/rm`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const apiErrors = {};
          data.errors.forEach((err) => {
            const fieldName = err.path[0];
            apiErrors[fieldName] = err.message;
          });
          setErrors(apiErrors);
        }
        throw new Error(data.message || 'Error al guardar');
      }

      toast.success("¡Marca guardada! 🔥");
      setIsCalculated(false);
      setResults(null);
      setWeight('');
      setReps('');
      fetchSavedRMs(false);

    } catch (error) { 
      toast.error(error.message); 
    }
  };

  const handleDeleteRM = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar?',
      text: "Se borrará del historial.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FFA500',
      cancelButtonColor: '#222',
      confirmButtonText: 'Eliminar',
      background: '#141414', color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/rm/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          toast.success("Registro eliminado");
          fetchSavedRMs(false);
        }
      } catch (error) { toast.error("Error al eliminar"); }
    }
  };

  return (
    <div className={styles.rmContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Calculadora <span>1RM</span></h2>
          <p>Mide y supera tus límites teóricos.</p>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.formSide}>
          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Grupo Muscular</label>
              <select 
                className={`${styles.fullWidthSelect} ${errors.muscleGroup ? styles.inputError : ''}`} 
                value={selectedGroup} 
                onChange={(e) => {
                  setSelectedGroup(e.target.value); 
                  setSelectedExercise(''); 
                  setIsCalculated(false);
                  setErrors(prev => ({...prev, muscleGroup: ''}));
                }}
              >
                <option value="">Seleccionar grupo...</option>
                {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.muscleGroup && <span className={styles.errorText}>{errors.muscleGroup}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Ejercicio</label>
              <select 
                className={`${styles.fullWidthSelect} ${errors.exerciseName ? styles.inputError : ''}`} 
                value={selectedExercise} 
                disabled={!selectedGroup} 
                onChange={(e) => {
                  setSelectedExercise(e.target.value); 
                  setIsCalculated(false);
                  setErrors(prev => ({...prev, exerciseName: ''}));
                }}
              >
                <option value="">Seleccionar ejercicio...</option>
                {filteredExercises.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
              </select>
              {errors.exerciseName && <span className={styles.errorText}>{errors.exerciseName}</span>}
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Peso (Kg)</label>
                <input 
                  type="number" 
                  className={errors.weightUsed ? styles.inputError : ''}
                  value={weight} 
                  onChange={(e) => {
                    setWeight(e.target.value); 
                    setIsCalculated(false);
                    setErrors(prev => ({...prev, weightUsed: ''}));
                  }} 
                  placeholder="0" 
                />
                {errors.weightUsed && <span className={styles.errorText}>{errors.weightUsed}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Reps</label>
                <input 
                  type="number" 
                  className={errors.repsDone ? styles.inputError : ''}
                  value={reps} 
                  onChange={(e) => {
                    setReps(e.target.value); 
                    setIsCalculated(false);
                    setErrors(prev => ({...prev, repsDone: ''}));
                  }} 
                  placeholder="0" 
                />
                {errors.repsDone && <span className={styles.errorText}>{errors.repsDone}</span>}
              </div>
            </div>

            <button 
              onClick={isCalculated ? handleSaveRM : calculateRM} 
              className={isCalculated ? styles.saveBtnActive : styles.calcBtn}
            >
              {isCalculated ? '¡GUARDAR RÉCORD! 🔥' : 'CALCULAR 1RM'}
            </button>
          </div>
        </div>

        <div className={styles.resultsSide}>
          {results ? (
            <div className={styles.resultsGrid}>
              <div className={styles.resultCard}>
                <span>MÉTODO EPLEY</span>
                <h3>{results.epley} <small>Kg</small></h3>
              </div>
              <div className={styles.resultCard}>
                <span>MÉTODO BRZYCKI</span>
                <h3>{results.brzycki} <small>Kg</small></h3>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>Calcula tu 1RM para desbloquear tus estadísticas.</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <h3>Mi Historial <span>Personal</span></h3>
        </div>
        <div className={styles.historyList}>
          {loading && page === 1 ? (
             <p className={styles.emptyHistory}>Cargando historial...</p>
          ) : savedRMs.map((rm) => {
            const isBest = bestResultsByExercise[rm.exerciseName] === rm.brzyckiResult;
            return (
              <article key={rm._id} className={`${styles.historyCard} ${isBest ? styles.prCard : ''}`}>
                <button className={styles.deleteBtn} onClick={() => handleDeleteRM(rm._id)}>✕</button>
                {isBest && <div className={styles.prBadge}>NUEVA MARCA 🔥</div>}
                <div className={styles.dateBadge}>{new Date(rm.createdAt).toLocaleDateString()}</div>
                
                <div className={styles.dataGroup}>
                  <div className={styles.dataItem}>
                    <small>Ejercicio</small>
                    <strong>{rm.exerciseName}</strong>
                  </div>
                  <div className={styles.dataItem}>
                    <small>Levantamiento</small>
                    <strong>{rm.weightUsed}kg x {rm.repsDone}</strong>
                  </div>
                  <div className={styles.dataItem}>
                    <small>1RM Máximo</small>
                    <strong className={styles.orange}>{rm.brzyckiResult} kg</strong>
                  </div>
                </div>
              </article>
            );
          })}
          
          {hasNextPage && (
            <button className={styles.loadMoreBtn} onClick={() => fetchSavedRMs(true)} disabled={loadingMore}>
              {loadingMore ? 'Cargando...' : 'Ver más registros'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};