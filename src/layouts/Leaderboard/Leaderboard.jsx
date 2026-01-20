import React, { useState, useEffect } from 'react';
import styles from './Leaderboard.module.scss';
import { useAuthStore } from '../../store/authStore';

export const Leaderboard = () => {
  const { token, user } = useAuthStore();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const res = await fetch('http://localhost:8080/api/rm/leaderboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setRanking(data);
  };

  return (
    <div className={styles.leaderboardContainer}>
      <div className={styles.header}>
        <h2>Hall of <span>Fame</span> 🏆</h2>
        <p>Los levantamientos más pesados de la comunidad EvolutFit.</p>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Ejercicio</span>
          <span>Atleta</span>
          <span>Récord</span>
        </div>
        
        {ranking.map((item) => (
          <div key={item._id} className={`${styles.row} ${item.user.name === user.name ? styles.isMe : ''}`}>
            <div className={styles.exerciseInfo}>
              <strong>{item._id}</strong>
              <small>{item.muscleGroup}</small>
            </div>
            
            <div className={styles.userInfo}>
              <div className={styles.avatar}>{item.user.name[0]}{item.user.lastname[0]}</div>
              <span>{item.user.name} {item.user.lastname} {item.user.name === user.name && '(Tú)'}</span>
            </div>

            <div className={styles.weightInfo}>
              <span>{item.maxWeight} <b>Kg</b></span>
              {item.user.name === user.name ? <p>¡Eres el líder! 👑</p> : <p>A batir ⚡</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};