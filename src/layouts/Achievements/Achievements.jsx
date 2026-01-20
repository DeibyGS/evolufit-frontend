import React, { useState, useEffect } from 'react';
import achievementsData from '../../data/achievements.json';
import styles from './Achievements.module.scss';
import { useAuthStore } from '../../store/authStore';

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
        setTotalWeight(data.totalVolume || data.totalWeight || 0);
      }
    } catch (error) {
      console.error('Error fetching total weight:', error);
    }
  };

  useEffect(() => {
    if (token) fetchTotalWeight();
  }, [token]);

  const categories = ['Todos', 'Bronce', 'Plata', 'Oro', 'Épico'];

  const filteredAchievements = filter === 'Todos' 
    ? achievementsData 
    : achievementsData.filter(ach => ach.category === filter);

  return (
    <div className={styles.achievementsContainer}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h2>Mis <span>Logros</span></h2>
          <p>Supera tus límites y desbloquea medallas por volumen de entrenamiento.</p>
        </div>
        
        {/* El peso total resaltado con el amarillo de tu logo */}
        <div className={styles.totalWeightBadge}>
          <small>VOLUMEN TOTAL</small>
          <strong>{totalWeight.toLocaleString()} <span>kg</span></strong>
        </div>
      </header>

      <div className={styles.filterBar}>
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
      </div>

      <div className={styles.grid}>
        {filteredAchievements.map((ach) => {
          const isUnlocked = totalWeight >= ach.targetWeight;
          const progress = Math.min((totalWeight / ach.targetWeight) * 100, 100);

          return (
            <article 
              key={ach.id} 
              className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`}
            >
              <div className={styles.imageWrapper}>
                <img src={ach.imagePath} alt={ach.title} className={styles.medalImg} />
                {!isUnlocked && <div className={styles.lockOverlay}><span>🔒</span></div>}
              </div>

              <div className={styles.info}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.categoryBadge} ${styles[ach.category.toLowerCase()]}`}>
                    {ach.category}
                  </span>
                  {isUnlocked && <span className={styles.checkIcon}>✓</span>}
                </div>
                
                <h3>{ach.title}</h3>
                <p className={styles.equivalence}>⚡ {ach.equivalence}</p>
                <p className={styles.description}>{ach.description}</p>
                
                {!isUnlocked && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div className={styles.fill} style={{ width: `${progress}%` }}></div>
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
      </div>
    </div>
  );
};