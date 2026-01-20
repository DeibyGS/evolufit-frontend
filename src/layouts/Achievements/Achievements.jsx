import React, { useState, useEffect, useMemo } from 'react';
import achievementsData from '../../data/achievements.json';
import styles from './Achievements.module.scss';
import { useAuthStore } from '../../store/authStore';

/**
 * COMPONENTE DE LOGROS (ACHIEVEMENTS)
 * Visualiza el progreso del usuario basándose en el volumen total (kg) levantado.
 */
export const Achievements = () => {
  const [filter, setFilter] = useState('Todos');
  const [totalWeight, setTotalWeight] = useState(0);
  const { token } = useAuthStore();

  const fetchTotalWeight = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/workouts/total-volume', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Fallback para diferentes estructuras de respuesta
        setTotalWeight(data.totalVolume || data.totalWeight || 0);
      }
    } catch (error) {
      console.error('Error fetching total weight:', error);
    }
  };

  useEffect(() => {
    if (token) fetchTotalWeight();
  }, [token]);

  // Constantes de UI
  const categories = useMemo(() => ['Todos', 'Bronce', 'Plata', 'Oro', 'Épico'], []);

  // Filtrado optimizado con useMemo para evitar cálculos en cada re-render innecesario
  const filteredAchievements = useMemo(() => {
    return filter === 'Todos' 
      ? achievementsData 
      : achievementsData.filter(ach => ach.category === filter);
  }, [filter]);

  return (
    <div className={styles.achievementsContainer}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h2>Mis <span>Logros</span></h2>
          <p>Supera tus límites y desbloquea medallas por volumen de entrenamiento.</p>
        </div>
        
        {/* KPI de Volumen Total */}
        <div className={styles.totalWeightBadge}>
          <small>VOLUMEN TOTAL</small>
          <strong>{totalWeight.toLocaleString()} <span>kg</span></strong>
        </div>
      </header>

      {/* Barra de Filtros */}
      <nav className={styles.filterBar} aria-label="Filtro de categorías">
        <div className={styles.radioOptions}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Grid de Medallas */}
      <section className={styles.grid}>
        {filteredAchievements.map((ach) => {
          const isUnlocked = totalWeight >= ach.targetWeight;
          // Cálculo de progreso normalizado entre 0 y 100
          const progress = Math.min((totalWeight / ach.targetWeight) * 100, 100);

          return (
            <article 
              key={ach.id} 
              className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`}
            >
              <div className={styles.imageWrapper}>
                <img 
                   src={ach.imagePath} 
                   alt={`Medalla ${ach.title}`} 
                   className={styles.medalImg} 
                   loading="lazy" 
                />
                {!isUnlocked && (
                  <div className={styles.lockOverlay} aria-hidden="true">
                    <span>🔒</span>
                  </div>
                )}
              </div>

              <div className={styles.info}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.categoryBadge} ${styles[ach.category.toLowerCase()]}`}>
                    {ach.category}
                  </span>
                  {isUnlocked && <span className={styles.checkIcon} aria-label="Completado">✓</span>}
                </div>
                
                <h3>{ach.title}</h3>
                <p className={styles.equivalence}>⚡ {ach.equivalence}</p>
                <p className={styles.description}>{ach.description}</p>
                
                {/* Solo mostramos la barra si el logro está bloqueado */}
                {!isUnlocked && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.fill} 
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <div className={styles.progressText}>
                      <span>{progress.toFixed(0)}%</span>
                      <span>Faltan {(ach.targetWeight - totalWeight).toLocaleString()} kg</span>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};