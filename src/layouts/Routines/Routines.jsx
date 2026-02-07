import React, { useState, useEffect } from 'react';
import styles from './Routines.module.scss';
import { toast } from 'sonner';
import { EXERCISES_DB, MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

export const Routines = () => {
  const { token } = useAuthStore();
  
  // --- ESTADOS DE CONTROL ---
  const [isStarted, setIsStarted] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  
  // --- ESTADOS DE PAGINACIÓN ---
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // --- ESTADOS DE CONFIGURACIÓN DE SERIES ---
  const [numSeries, setNumSeries] = useState(1);
  const [series, setSeries] = useState([{ id: "first-set", reps: '', weight: '' }]);
  const [workoutList, setWorkoutList] = useState([]);

  const filteredExercises = EXERCISES_DB.filter(ex => ex.group === selectedGroup);

  // Carga inicial del historial
  useEffect(() => {
    if (token) fetchHistory(1);
  }, [token]);

  /**
   * Obtiene el historial paginado del backend
   * @param {number} pageToFetch - La página que queremos solicitar
   */
  const fetchHistory = async (pageToFetch = 1) => {
    setIsLoadingHistory(true);
    try {
      const limit = 5;
      const response = await fetch(
        `${BASE_URL}/workouts/my-workouts?page=${pageToFetch}&limit=${limit}`, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Si es la página 1, reemplazamos el array. Si es > 1, concatenamos los nuevos.
        setHistory(prev => pageToFetch === 1 ? data.workouts : [...prev, ...data.workouts]);
        setHasMore(data.hasMore);
        setPage(data.currentPage);
      } 
    } catch (error) { 
      console.error("Error historial:", error); 
      toast.error("No se pudo cargar el historial");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleLoadMore = () => {
    fetchHistory(page + 1);
  };

  const handleNumSeriesChange = (e) => {
    const count = parseInt(e.target.value);
    setNumSeries(count);
    const newSeries = Array.from({ length: count }, (_, i) => (
      series[i] || { id: crypto.randomUUID(), reps: '', weight: '' }
    ));
    setSeries(newSeries);
  };

  const updateSerie = (id, field, value) => {
    const val = value < 0 ? 0 : value;
    setSeries(series.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const addExerciseToSession = () => {
    if (!selectedExercise || series.some(s => s.reps === '')) {
      return toast.error("Completa todos los datos");
    }
    const newEntry = {
      muscleGroup: selectedGroup,
      exerciseName: selectedExercise,
      sets: series.map(s => ({ reps: Number(s.reps), weight: Number(s.weight) }))
    };
    setWorkoutList([...workoutList, newEntry]);
    setSelectedExercise('');
    setNumSeries(1);
    setSeries([{ id: "first-set", reps: '', weight: '' }]);
    toast.info("¡Ejercicio añadido!");
  };

  const removeExerciseFromList = (index) => {
    const newList = [...workoutList];
    newList.splice(index, 1);
    setWorkoutList(newList);
  };

  const finishSession = async () => {
    if (workoutList.length === 0) return toast.error("No hay ejercicios");
    
    const result = await Swal.fire({
      title: '¿Terminar entrenamiento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FFA500',
      background: '#111', color: '#fff',
    });

    if (result.isConfirmed) {
      const payload = { routineName: routineName || "Entrenamiento del día", exercises: workoutList };
      try {
        const res = await fetch(`${BASE_URL}/workouts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success("¡Guardado! 🔥");
          setIsStarted(false); 
          setRoutineName(''); 
          setWorkoutList([]); 
          fetchHistory(1); // Recargamos desde la página 1 para ver el nuevo
        }
      } catch (error) { toast.error("Error al guardar"); }
    }
  };

  return (
    <div className={styles.routinesContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Mis <span>Rutinas</span></h2>
          <p>Registra tus sesiones y visualiza tu progreso.</p>
        </div>
        {!isStarted && (
           <button className={styles.shareBtn} onClick={() => setIsStarted(true)}>
             ➕ Nueva Sesión
           </button>
        )}
      </header>

      {!isStarted ? (
        <div className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <h3>Línea de Tiempo de <span>Progreso</span></h3>
          </div>
          
          <div className={styles.historyList}>
            {history.map((workout) => (
              <article key={workout._id} className={styles.historyCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.dateBadge}>{new Date(workout.createdAt).toLocaleDateString()}</div>
                  <strong className={styles.routineTitle}>{workout.routineName}</strong>
                </div>

                <div className={styles.exerciseDetailList}>
                  {workout.exercises.map((ex, idx) => (
                    <div key={idx} className={styles.exerciseDetailItem}>
                      <div className={styles.exInfo}>
                        <small>{ex.muscleGroup}</small>
                        <strong>{ex.exerciseName}</strong>
                      </div>
                      <div className={styles.seriesGrid}>
                        {ex.sets.map((set, sIdx) => (
                          <div key={sIdx} className={styles.setTag}>
                            <small>S{sIdx + 1}</small>
                            <span>{set.reps} x <b>{set.weight}kg</b></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* BOTÓN CARGAR MÁS */}
          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button 
                className={styles.loadMoreBtn} 
                onClick={handleLoadMore}
                disabled={isLoadingHistory}
              >
                {isLoadingHistory ? 'Cargando...' : 'Cargar entrenamientos anteriores'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.activeRoutine}>
          <div className={styles.routineNameGroup}>
  <input 
    className={styles.routineNameInput}
    placeholder="Ej: Empuje - Enfoque Pecho y Tríceps 🔥"
    value={routineName}
    onChange={(e) => setRoutineName(e.target.value)}
    autoFocus
  />
  <span className={styles.inputFocusLine}></span>
</div>

          <div className={styles.filterBar}>
            <div className={styles.tagChips}>
              {MUSCLE_GROUPS.map(group => (
                <button 
                  key={group} 
                  className={selectedGroup === group ? styles.tagActive : ''}
                  onClick={() => {setSelectedGroup(group); setSelectedExercise('');}}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {selectedGroup && (
            <div className={styles.selectionGrid}>
               <div className={styles.inputLayout}>
                  <label>Ejercicio</label>
                  <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
                    <option value="">-- Selecciona --</option>
                    {filteredExercises.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
                  </select>
               </div>
               <div className={styles.inputLayout}>
                  <label>Series</label>
                  <select value={numSeries} onChange={handleNumSeriesChange}>
                    {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1} Series</option>)}
                  </select>
               </div>
            </div>
          )}

          {selectedExercise && (
            <div className={styles.setsConfig}>
              <div className={styles.configTable}>
                {series.map((s, index) => (
                  <div key={s.id} className={styles.setRow}>
                    <span className={styles.setIndex}>{index + 1}</span>
                    <input type="number" placeholder="Reps" value={s.reps} onChange={(e) => updateSerie(s.id, 'reps', e.target.value)} />
                    <input type="number" placeholder="Kg" value={s.weight} onChange={(e) => updateSerie(s.id, 'weight', e.target.value)} />
                  </div>
                ))}
              </div>
              <div className={styles.actionGroup}>
                <button className={styles.addBtn} onClick={addExerciseToSession}>Añadir Ejercicio</button>
              </div>
            </div>
          )}

          {/* VISTA PREVIA BORRADOR */}
          {workoutList.length > 0 && (
            <div className={styles.workoutPreview}>
              <h3>Resumen de sesión actual</h3>
              <div className={styles.previewContainer}>
                {workoutList.map((item, index) => (
                  <div key={index} className={styles.previewItem}>
                    <div className={styles.previewInfo}>
                      <strong>{item.exerciseName}</strong>
                      <p>{item.sets.length} series registradas</p>
                    </div>
                    <button onClick={() => removeExerciseFromList(index)} className={styles.removeBtn}>
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.footerActions}>
                <button className={styles.finishBtn} onClick={finishSession}>Finalizar Entrenamiento 🔥</button>
                <button className={styles.cancelBtn} onClick={() => setIsStarted(false)}>Descartar Sesión</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};