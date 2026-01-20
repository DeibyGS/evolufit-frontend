import React, { useState, useEffect } from 'react';
import styles from './Routines.module.scss';
import { toast } from 'sonner';
import { EXERCISES_DB, MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import Swal from 'sweetalert2';

export const Routines = () => {
  const { token } = useAuthStore();
  const [isStarted, setIsStarted] = useState(false);
  const [routineName, setRoutineName] = useState('');
  
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [numSeries, setNumSeries] = useState(1);
  const [series, setSeries] = useState([{ id: "first-set", reps: '', weight: '' }]);
  const [workoutList, setWorkoutList] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  
  const [history, setHistory] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Inicializado en 10

  const filteredExercises = EXERCISES_DB.filter(ex => ex.group === selectedGroup);

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/workouts/my-workouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
       
        if(Array.isArray(data)) {
          const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setHistory(sortedData);
      }else {
          setHistory([]);
      } 
    } 
  }catch (error) {
      console.error("Error cargando historial:", error);
    };};

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  // --- Manejadores de eventos ---
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
      return toast.error("Completa todos los datos del ejercicio");
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

  const finishSession = async () => {
    if (workoutList.length === 0) return toast.error("No hay ejercicios en la sesión");

    const result = await Swal.fire({
      title: '¿Terminar entrenamiento?',
      text: "Se guardará tu progreso en el historial.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FFA500',
      confirmButtonText: 'Sí, finalizar',
      background: '#111', color: '#fff',
    });

    if (result.isConfirmed) {
      const fullPayload = {
        routineName: routineName || "Entrenamiento del día",
        exercises: workoutList,
      };

      try {
        const response = await fetch('http://localhost:8080/api/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(fullPayload)
        });

        if (response.ok) {
          toast.success("¡Entrenamiento guardado! 🔥");
          setIsStarted(false);
          setRoutineName('');
          setWorkoutList([]);
          setVisibleCount(10); // Resetear vista al guardar uno nuevo
          fetchHistory();
        }
      } catch (error) {
        toast.error("Error al guardar la sesión");
      }
    }
  };

  const deleteWorkout = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar entreno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d',
      confirmButtonText: 'Borrar',
      background: '#111', color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:8080/api/workouts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success("Eliminado");
          fetchHistory();
        }
      } catch (error) {
        toast.error("Error al borrar");
      }
    }
  };

  return (
    <div className={styles.routinesContainer}>
      <header className={styles.header}>
        <h2>Mis <span>Rutinas</span></h2>
        <p>Registra tus sesiones y visualiza tu historial de entrenamiento.</p>
      </header>

      {!isStarted ? (
        <>
          <div className={styles.startSection}>
            <button className={styles.startBtn} onClick={() => setIsStarted(true)}>
              + Iniciar Nueva Sesión
            </button>
          </div>

          <div className={styles.historySection}>
            <h3>Línea de Tiempo de <span>Progreso</span></h3>
            <div className={styles.historyList}>
              {history.length > 0 ? (
                <>
                  {/* AQUÍ ESTÁ LA LÓGICA DE PAGINACIÓN CORRECTA */}
                  {history.slice(0, visibleCount).map((workout) => (
                    <div key={workout._id} className={styles.historyCard}>
                      <button className={styles.deleteBtn} onClick={() => deleteWorkout(workout._id)}>✕</button>
                      
                      <div className={styles.cardHeader}>
                        <div className={styles.dateBadge}>{new Date(workout.createdAt).toLocaleDateString()}</div>
                        <strong className={styles.routineTitle}>{workout.routineName}</strong>
                      </div>

                      <div className={styles.exerciseDetailList}>
                        {workout.exercises.map((ex, idx) => (
                          <div key={idx} className={styles.exerciseDetailItem}>
                            <div className={styles.exName}>
                              <span>{ex.muscleGroup}</span>
                              <strong>{ex.exerciseName}</strong>
                            </div>
                            <div className={styles.seriesGrid}>
                              {ex.sets.map((set, sIdx) => (
                                <div key={sIdx} className={styles.setTag}>
                                  <small>S{sIdx + 1}</small>
                                  <span>{set.reps} x <strong>{set.weight}kg</strong></span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Botón de Cargar Más */}
                  {visibleCount < history.length && (
                    <div className={styles.loadMoreWrapper}>
                      <button className={styles.loadMoreBtn} onClick={loadMore}>
                        Ver sesiones anteriores
                      </button>
                      <p className={styles.loadMoreInfo}>
                        Mostrando {visibleCount} de {history.length} entrenamientos
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className={styles.noHistory}>Aún no tienes entrenamientos registrados.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ... El resto del formulario de rutina activa se mantiene igual ... */
        <div className={styles.activeRoutine}>
          <div className={styles.routineHeaderInput}>
            <input 
              type="text" 
              className={styles.routineNameInput}
              placeholder="Nombre de la rutina..."
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
            />
          </div>

          <div className={styles.muscleSelector}>
            {MUSCLE_GROUPS.map(group => (
              <button 
                key={group} 
                className={selectedGroup === group ? styles.activeGroup : styles.groupBtn}
                onClick={() => {setSelectedGroup(group); setSelectedExercise('');}}
              >
                {group}
              </button>
            ))}
          </div>

          {selectedGroup && (
            <div className={styles.selectionGrid}>
              <div className={styles.inputGroup}>
                <label>Ejercicio</label>
                <select className={styles.fullWidthSelect} value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  {filteredExercises.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Series</label>
                <select className={styles.fullWidthSelect} value={numSeries} onChange={handleNumSeriesChange}>
                  {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1} Series</option>)}
                </select>
              </div>
            </div>
          )}

          {selectedExercise && (
            <div className={styles.setsConfig}>
              <div className={styles.tableLabels}><span>Set</span><span>Reps</span><span>Peso (Kg)</span></div>
              {series.map((s, index) => (
                <div key={s.id} className={styles.setRow}>
                  <div className={styles.setIndex}>{index + 1}</div>
                  <input type="number" placeholder="0" value={s.reps} onChange={(e) => updateSerie(s.id, 'reps', e.target.value)} />
                  <input type="number" placeholder="0" value={s.weight} onChange={(e) => updateSerie(s.id, 'weight', e.target.value)} />
                </div>
              ))}
              <div className={styles.exerciseActions}>
                <button className={styles.addExerciseBtn} onClick={addExerciseToSession}>Añadir Ejercicio</button>
                <button className={styles.clearBtn} onClick={() => setSelectedExercise('')}>Cancelar</button>
              </div>
            </div>
          )}

          {workoutList.length > 0 && (
            <div className={styles.sessionSummary}>
              <div className={styles.divider}></div>
              <h4>Ejercicios añadidos: {workoutList.length}</h4>
              <div className={styles.summaryActions}>
                <button className={styles.finishBtn} onClick={finishSession}>Finalizar Entrenamiento 🔥</button>
                <button className={styles.previewBtn} onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? 'Ocultar Lista' : 'Ver Detalles'}
                </button>
              </div>
              {showPreview && (
                <div className={styles.historyList}>
                  {workoutList.map((item, index) => (
                    <div key={index} className={styles.historyCard}>
                      <div className={styles.dateBadge}>#{index + 1}</div>
                      <div className={styles.dataGroup}>
                        <div className={styles.dataItem}><small>Ejercicio</small><strong>{item.exerciseName}</strong></div>
                        <div className={styles.dataItem}><small>Sets</small><strong>{item.sets.length}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};