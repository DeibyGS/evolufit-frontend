import React, { useState, useEffect } from 'react';
import styles from './Routines.module.scss';
import { toast } from 'sonner';
import { EXERCISES_DB, MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

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
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredExercises = EXERCISES_DB.filter(ex => ex.group === selectedGroup);

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/workouts/my-workouts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if(Array.isArray(data)) {
          const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setHistory(sortedData);
        }
      } 
    } catch (error) { console.error("Error historial:", error); }
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
          setIsStarted(false); setRoutineName(''); setWorkoutList([]); fetchHistory();
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
            {history.slice(0, visibleCount).map((workout) => (
              <article key={workout._id} className={styles.historyCard}>
                <button className={styles.deleteBtn} onClick={() => {/* delete logic */}}>✕</button>
                
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
        </div>
      ) : (
        <div className={styles.activeRoutine}>
          <div className={styles.inputGroup}>
            <input 
              className={styles.routineNameInput}
              placeholder="Nombre del entrenamiento..."
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
            />
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

          {workoutList.length > 0 && (
            <div className={styles.footerActions}>
              <button className={styles.finishBtn} onClick={finishSession}>Finalizar Sesión 🔥</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};