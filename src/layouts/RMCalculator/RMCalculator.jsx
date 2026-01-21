import React, { useState, useEffect } from 'react';
import styles from './RMCalculator.module.scss';
import { EXERCISES_DB, MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

export const RMCalculator = () => {
  const { token } = useAuthStore();
  
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [results, setResults] = useState(null);
  const [savedRMs, setSavedRMs] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const filteredExercises = EXERCISES_DB.filter(ex => ex.group === selectedGroup);

  useEffect(() => {
    fetchSavedRMs();
  }, []);

  const fetchSavedRMs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/rm', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setSavedRMs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  const calculateRM = (e) => {
    e.preventDefault();
    if (!weight || !reps || reps <= 0) {
      return toast.error("Introduce peso y repeticiones válidas");
    }
    const w = parseFloat(weight);
    const r = parseInt(reps);

    const epley = w * (1 + r / 30);
    const brzycki = w / (1.0278 - 0.0278 * r);

    setResults({
      epley: epley.toFixed(1),
      brzycki: brzycki.toFixed(1)
    });
    setIsCalculated(true);
  };

  const handleSaveRM = async () => {
    if (!selectedExercise) return toast.error("Selecciona un ejercicio");

    const currentBrzycki = Number(results.brzycki);
    const previousBest = savedRMs
      .filter(rm => rm.exerciseName === selectedExercise)
      .reduce((prev, current) => (prev.brzyckiResult > current.brzyckiResult) ? prev : current, null);

    let isNewRecord = false;
    if (!previousBest || currentBrzycki > previousBest.brzyckiResult) {
      isNewRecord = true;
      if (previousBest) {
        await Swal.fire({
          title: '¡NUEVO RÉCORD PERSONAL! 🔥',
          text: `Has superado tu marca de ${previousBest.brzyckiResult}kg por ${(currentBrzycki - previousBest.brzyckiResult).toFixed(1)}kg.`,
          icon: 'success',
          confirmButtonColor: '#FFA500',
          background: '#111', color: '#fff'
        });
      }
    }

    const payload = {
      exerciseName: selectedExercise,
      muscleGroup: selectedGroup,
      weightUsed: Number(weight),
      repsDone: Number(reps),
      epleyResult: Number(results.epley),
      brzyckiResult: Number(results.brzycki)
    };

    try {
      const response = await fetch('http://localhost:8080/api/rm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(isNewRecord ? "¡Nuevo récord guardado!" : "Progreso guardado");
        setIsCalculated(false);
        setResults(null);
        fetchSavedRMs(); 
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    }
  };

  const handleDeleteRM = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, eliminar',
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
      } catch (error) {
        toast.error("Error al eliminar" + error.message);
      }
    }
  };

  return (
    <div className={styles.rmContainer}>
      <header className={styles.header}>
        <h2>Calculadora <span>1RM</span></h2>
        <p>Gestiona tus marcas y mide tu evolución en el tiempo.</p>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.formSide}>
          <form className={styles.form} onSubmit={isCalculated ? (e) => { e.preventDefault(); handleSaveRM(); } : calculateRM}>
            <div className={styles.inputGroup}>
              <label>Grupo Muscular</label>
              <select className={styles.fullWidthSelect} value={selectedGroup} onChange={(e) => {setSelectedGroup(e.target.value); setSelectedExercise('');}}>
                <option value="">-- Selecciona --</option>
                {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Ejercicio</label>
              <select className={styles.fullWidthSelect} value={selectedExercise} disabled={!selectedGroup} onChange={(e) => setSelectedExercise(e.target.value)}>
                <option value="">-- Ejercicio --</option>
                {filteredExercises.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
              </select>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}><label>Peso (Kg)</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0" /></div>
              <div className={styles.inputGroup}><label>Reps</label><input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="0" /></div>
            </div>

            <button type="submit" className={isCalculated ? styles.saveBtnActive : styles.calcBtn}>
              {isCalculated ? '💾 GUARDAR RESULTADOS' : 'CALCULAR MÉTRICAS'}
            </button>
            {isCalculated && <button type="button" className={styles.clearBtn} onClick={() => {setIsCalculated(false); setResults(null);}}>CANCELAR</button>}
          </form>
        </div>

        <div className={styles.resultsSide}>
          {results ? (
            <div className={styles.resultsGrid}>
              <div className={styles.resultCard}><span>Epley</span><h3>{results.epley} <small>Kg</small></h3></div>
              <div className={styles.resultCard}><span>Brzycki</span><h3>{results.brzycki} <small>Kg</small></h3></div>
            </div>
          ) : (
            <div className={styles.placeholder}><p>Introduce datos para iniciar el análisis.</p></div>
          )}
        </div>
      </div>

      <div className={styles.historySection}>
        <h3>Línea de Tiempo de <span>Progreso</span></h3>
        <div className={styles.historyList}>
          {savedRMs.length > 0 ? (
            savedRMs.map((rm) => {
                const isPR = !savedRMs.some(item => item.exerciseName === rm.exerciseName && item.brzyckiResult > rm.brzyckiResult);
                return (
                  <div key={rm._id} className={`${styles.historyCard} ${isPR ? styles.prCard : ''}`}>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteRM(rm._id)}>✕</button>
                    <div className={styles.dateBadge}>{new Date(rm.createdAt).toLocaleDateString()}</div>
                    <div className={styles.dataGroup}>
                      <div className={styles.dataItem}><small>Ejercicio</small><strong>{rm.exerciseName} {isPR && '🔥'}</strong></div>
                      <div className={styles.dataItem}><small>Levantamiento</small><strong>{rm.weightUsed}kg x {rm.repsDone}</strong></div>
                      <div className={styles.dataItem}><small>RM Estimado</small><strong className={styles.orange}>{rm.brzyckiResult}kg</strong></div>
                    </div>
                  </div>
                );
            })
          ) : (
            <p className={styles.noHistory}>Aún no has guardado ningún RM.</p>
          )}
        </div>
      </div>
    </div>
  );
};