import React, { useState, useEffect, useMemo } from 'react';
import achievementsData from '../../data/achievements.json';
import styles from './Achievements.module.scss';
import { useAuthStore } from '../../store/authStore';
import { BASE_URL } from '../../api/API';

export const Achievements = () => {
  const [filter, setFilter] = useState('Todos');
  const [totalWeight, setTotalWeight] = useState(0);
  const { token } = useAuthStore();

  const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dgscloudinary/image/upload/v1769694977/achievements-EvolutFit";

  const fetchTotalWeight = async () => {
    try {
      const response = await fetch(`${BASE_URL}/workouts/total-volume`, {
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
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (token) fetchTotalWeight();
  }, [token]);

  const categories = useMemo(() => ['Todos', 'Bronce', 'Plata', 'Oro', 'Épico'], []);

  const filteredAchievements = useMemo(() => {
    return filter === 'Todos' 
      ? achievementsData 
      : achievementsData.filter(ach => ach.category === filter);
  }, [filter]);

  return (
    <div className={styles.achievementsContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Mis <span>Logros</span></h2>
          <p>Supera tus límites y desbloquea medallas por volumen.</p>
        </div>
        
        <div className={styles.totalWeightBadge}>
          <small>VOLUMEN TOTAL</small>
          <strong>{totalWeight.toLocaleString()} <span>kg</span></strong>
        </div>
      </header>

      <nav className={styles.filterBar}>
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

      <section className={styles.postsGrid}>
        {filteredAchievements.map((ach) => {
          const isUnlocked = totalWeight >= ach.targetWeight;
          const progress = Math.min((totalWeight / ach.targetWeight) * 100, 100);

          return (
            <article 
              key={ach.id} 
              className={`${styles.achievementCard} ${isUnlocked ? styles.unlocked : styles.locked}`}
            >
              <div className={styles.imageWrapper}>
                <img 
                   src={`${CLOUDINARY_BASE_URL}${ach.imagePath}`} 
                   alt={ach.title} 
                   className={styles.medalImg} 
                />
                {!isUnlocked && (
                  <div className={styles.lockOverlay}>
                    <span>🔒</span>
                  </div>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.categoryBadge} ${styles[ach.category.toLowerCase()]}`}>
                    {ach.category}
                  </span>
                  {isUnlocked && <span className={styles.checkIcon}>✓</span>}
                </div>
                
                <h4>{ach.title}</h4>
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
      </section>
    </div>
  );
};