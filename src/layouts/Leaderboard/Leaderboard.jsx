import React, { useState, useEffect } from 'react';
import styles from './Leaderboard.module.scss';
import { useAuthStore } from '../../store/authStore';

/**
 * COMPONENTE LEADERBOARD (HALL OF FAME)
 * Muestra los récords mundiales de la comunidad EvolutFit.
 * Filtra los levantamientos máximos (RM) por ejercicio y resalta al usuario actual.
 */
export const Leaderboard = () => {
  // Obtenemos el token para la petición y los datos del usuario para comparar el ranking
  const { token, user } = useAuthStore();
  const [ranking, setRanking] = useState([]);

  // Carga el ranking al montar el componente
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  /**
   * Petición al backend para obtener el ranking global.
   * Se espera una estructura donde cada item contenga datos del ejercicio y del usuario.
   */
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/rm/leaderboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      // Si la respuesta es exitosa, actualizamos el estado con la lista de récords
      if (res.ok) setRanking(data);
    } catch (error) {
      console.error("Error al conectar con la API de Ránking:", error);
    }
  };

  return (
    <div className={styles.leaderboardContainer}>
      {/* Encabezado con enfoque en comunidad y éxito */}
      <div className={styles.header}>
        <h2>Hall of <span>Fame</span> 🏆</h2>
        <p>Los levantamientos más pesados de la comunidad EvolutFit.</p>
      </div>

      {/* Contenedor principal de la tabla (Card con efecto Glassmorphism) */}
      <div className={styles.tableCard}>
        {/* Cabecera de columnas para Desktop */}
        <div className={styles.tableHeader}>
          <span>Ejercicio</span>
          <span>Atleta</span>
          <span>Récord</span>
        </div>
        
        {/* Mapeo del ranking: Se genera una fila por cada récord de ejercicio */}
        {ranking.map((item) => (
          <div 
            key={item._id} 
            // Si el nombre del atleta coincide con el usuario logueado, aplicamos estilo 'isMe'
            className={`${styles.row} ${item.user.name === user.name ? styles.isMe : ''}`}
          >
            {/* Columna 1: Datos del ejercicio y grupo muscular */}
            <div className={styles.exerciseInfo}>
              <strong>{item._id}</strong>
              <small>{item.muscleGroup}</small>
            </div>
            
            {/* Columna 2: Avatar e identidad del atleta */}
            <div className={styles.userInfo}>
              {/* Generamos un avatar con las iniciales del nombre y apellido */}
              <div className={styles.avatar}>
                {item.user.name[0]}{item.user.lastname[0]}
              </div>
              <span>
                {item.user.name} {item.user.lastname} 
                {/* Etiqueta especial si el registro es del usuario actual */}
                {item.user.name === user.name && ' (Tú)'}
              </span>
            </div>

            {/* Columna 3: Valor del récord y feedback motivacional */}
            <div className={styles.weightInfo}>
              <span>{item.maxWeight} <b>Kg</b></span>
              {item.user.name === user.name 
                ? <p>¡Eres el líder! 👑</p> 
                : <p>A batir ⚡</p>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};