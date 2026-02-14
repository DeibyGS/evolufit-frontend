import React, { useState, useEffect } from 'react';
import styles from './RMCalculator.module.scss';
import { EXERCISES_DB, MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

export const RMCalculator = () => {
  const { token } = useAuthStore();
  
  // Estados de Formulario y UI
  const [errors, setErrors] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [results, setResults] = useState(null);
  const [savedRMs, setSavedRMs] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const filteredExercises = EXERCISES_DB.filter(ex => ex.group === selectedGroup);

  useEffect(() => {
    if (token) fetchSavedRMs();
  }, [token]);

  const fetchSavedRMs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/rm`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setSavedRMs(Array.isArray(data) ? data : []);
    } catch (error) { 
      console.error("Error cargando historial:", error); 
    }
  };

  const calculateRM = (e) => {
    if(e) e.preventDefault();
    if(!selectedGroup) return toast.error("Selecciona un grupo muscular");
    if (!selectedExercise) return toast.error("Selecciona un ejercicio");
    if (weight <= 0) return toast.error("Introduce un peso válido");
    if (reps <= 0) return toast.error("Introduce repeticiones válidas");
    
    const w = parseFloat(weight);
    const r = parseInt(reps);
    
    // Fórmulas de estimación
    setResults({ 
      epley: Number((w * (1 + r / 30)).toFixed(1)), 
      brzycki: Number((w / (1.0278 - 0.0278 * r)).toFixed(1)) 
    });
    setIsCalculated(true);
    setErrors({});
  };

  const handleSaveRM = async () => {
    setErrors({});
    
    const payload = {
      exerciseName: selectedExercise,
      muscleGroup: selectedGroup,
      weightUsed: Number(weight),
      repsDone: Number(reps),
      epleyResult: results.epley,
      brzyckiResult: results.brzycki
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
          data.errors.forEach(err => { if (err.path) apiErrors[err.path] = err.message; });
          setErrors(apiErrors);
          return toast.error('Corrige los campos marcados');
        }
        throw new Error(data.message || 'Error inesperado');
      }

      // Notificación de Récord Personal
      if (data.isNewRecord) {
        await Swal.fire({
          title: '¡NUEVO RÉCORD PERSONAL! 🔥',
          text: `Has superado tu marca anterior en ${selectedExercise}.`,
          icon: 'success',
          confirmButtonColor: '#FFA500',
          background: '#111', color: '#fff'
        });
      }

      // Actualizar lista local y resetear campos
      setSavedRMs([data, ...savedRMs]);
      toast.success("Marca guardada correctamente");
      
      setIsCalculated(false);
      setResults(null);
      setWeight('');
      setReps('');
      setSelectedExercise('');
      setSelectedGroup('');


    } catch (error) { 
      toast.error(error.message || "Error al guardar"); 
    }
  };

  const handleDeleteRM = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d',
      confirmButtonText: 'Eliminar',
      background: '#111', color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/rm/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setSavedRMs(savedRMs.filter(rm => rm._id !== id));
          toast.success("Registro eliminado");
        }
      } catch (error) { toast.error("Error al eliminar"); }
    }
  };

  return (
    <div className={styles.rmContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Calculadora <span>1RM</span></h2>
          <p>Mide tu fuerza máxima teórica y registra tu evolución.</p>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.formSide}>
          <form className={styles.form} onSubmit={(e) => {
            e.preventDefault();
            isCalculated ? handleSaveRM() : calculateRM();
          }}>
            <div className={styles.inputGroup}>
              <label>Grupo Muscular</label>
              <select 
                className={styles.fullWidthSelect} 
                value={selectedGroup} 
                onChange={(e) => {setSelectedGroup(e.target.value); setSelectedExercise(''); setIsCalculated(false);}}
              >
                <option value="">-- Selecciona --</option>
                {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Ejercicio</label>
              <select 
                className={styles.fullWidthSelect} 
                value={selectedExercise} 
                disabled={!selectedGroup} 
                onChange={(e) => {setSelectedExercise(e.target.value); setIsCalculated(false);}}
              >
                <option value="">-- Selecciona ejercicio --</option>
                {filteredExercises.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
              </select>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Peso (Kg)</label>
                <input 
                  type="number" 
                  step="any" 
                  value={weight} 
                  onChange={(e) => {setWeight(e.target.value); setIsCalculated(false);}} 
                  placeholder="0" 
                />
                {errors.weightUsed && <span className={styles.errorText}>{errors.weightUsed}</span>}
                
              </div>
              <div className={styles.inputGroup}>
                <label>Reps</label>
                <input 
                  type="number" 
                  value={reps} 
                  onChange={(e) => {setReps(e.target.value); setIsCalculated(false);}} 
                  placeholder="0" 
                />
                {errors.repsDone && <span className={styles.errorText}>{errors.repsDone}</span>}
              </div>
            </div>

            <button type="submit" className={isCalculated ? styles.saveBtnActive : styles.calcBtn}>
              {isCalculated ? '💾 GUARDAR EN HISTORIAL' : 'CALCULAR 1RM'}
            </button>
            
            {isCalculated && (
              <button type="button" className={styles.clearBtn} onClick={() => {setIsCalculated(false); setResults(null);}}>
                CANCELAR
              </button>
            )}
          </form>
        </div>

        <div className={styles.resultsSide}>
          {results ? (
            <div className={styles.resultsGrid}>
              <div className={styles.resultCard}>
                <span>Estimación Epley</span>
                <h3>{results.epley} <small>Kg</small></h3>
              </div>
              <div className={styles.resultCard}>
                <span>Estimación Brzycki</span>
                <h3>{results.brzycki} <small>Kg</small></h3>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>Calcula tu 1RM para desbloquear tus estadísticas de fuerza.</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <h3>Historial de <span>Fuerza</span></h3>
        </div>
        <div className={styles.historyList}>
          {savedRMs.length > 0 ? (
            savedRMs.map((rm) => {
              const isPR = rm.isNewRecord === true; 
              return (
                <article 
                  key={rm._id} 
                  className={`${styles.historyCard} ${isPR ? styles.prCard : ''}`}
                >
                  <button className={styles.deleteBtn} onClick={() => handleDeleteRM(rm._id)}>✕</button>
                  
                  {isPR && <div className={styles.prBadge}>PR 🔥</div>}
                  
                  <div className={styles.dateBadge}>
                    {new Date(rm.createdAt).toLocaleDateString()}
                  </div>
                  
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
                      <small>1RM Estimado</small>
                      <strong className={styles.orange}>{rm.brzyckiResult}kg</strong>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className={styles.emptyHistory}>Sin registros previos.</p>
          )}
        </div>
      </div>
    </div>
  );
};