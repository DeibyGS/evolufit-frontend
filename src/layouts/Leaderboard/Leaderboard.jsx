import React, { useState, useEffect } from 'react';
import styles from './Leaderboard.module.scss';
import { useAuthStore } from '../../store/authStore';
import { BASE_URL } from '../../api/API';

export const Leaderboard = () => {
  const { token, user } = useAuthStore();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [token]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/rm/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setRanking(data);
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  return (
    <div className={styles.leaderboardContainer}>
      {/* Header Unificado */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Hall of <span>Fame</span> 🏆</h2>
          <p>Los levantamientos más pesados de la comunidad EvolutFit.</p>
        </div>
      </header>

      {/* Contenedor de Tabla con ADN EvolutFit */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Ejercicio</span>
          <span>Atleta</span>
          <span>Récord</span>
        </div>
        
        <div className={styles.rowsContainer}>
          {ranking.map((item) => {
            const isMe = item.user.name === user.name;
            return (
              <article 
                key={item._id} 
                className={`${styles.row} ${isMe ? styles.isMe : ''}`}
              >
                <div className={styles.exerciseInfo}>
                  <strong>{item._id}</strong>
                  <small>{item.muscleGroup}</small>
                </div>
                
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    {item.user.name[0]}{item.user.lastname[0]}
                  </div>
                  <span>
                    {item.user.name} {item.user.lastname} 
                    {isMe && <b className={styles.meTag}> (Tú)</b>}
                  </span>
                </div>

                <div className={styles.weightInfo}>
                  <span className={styles.weightValue}>{item.maxWeight} <b>Kg</b></span>
                  <p className={styles.statusText}>
                    {isMe ? '¡Eres el líder! 👑' : 'A batir ⚡'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};