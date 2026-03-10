import React, { useState, useEffect, useCallback, } from 'react';
import styles from './Leaderboard.module.scss';
import { useAuthStore } from '../../store/authStore';
import { BASE_URL } from '../../api/API';
import { toast } from 'sonner';

export const Leaderboard = () => {
  const { token, user } = useAuthStore();
  
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const LIMIT = 10;

  const fetchLeaderboard = useCallback(async (pageNumber = 1, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`${BASE_URL}/rm/leaderboard?page=${pageNumber}&limit=${LIMIT}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();

      if (response.ok) {
        const newItems = data.records || [];
        setRanking(prev => isInitial ? newItems : [...prev, ...newItems]);
        setHasNextPage(data.hasNextPage || false);
        setPage(pageNumber);
      } else {
        toast.error(data.message || "Error al cargar el ranking");
      }
    } catch (error) {
      console.error("🔥 Error EvoluFit:", error);
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchLeaderboard(1, true);
  }, [token, fetchLeaderboard]);

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      fetchLeaderboard(page + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando Hall of Fame...</p>
      </div>
    );
  }

  return (
    <div className={styles.leaderboardContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Hall of <span>Fame</span> 🏆</h2>
          <p>Los récords actuales de la comunidad EvoluFit</p>
        </div>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Ejercicio</span>
          <span>Atleta</span>
          <span>Récord</span>
        </div>
        
        <div className={styles.rowsContainer}>
          {ranking.map((item, index) => {
            // LÓGICA CRÍTICA: Comparación de IDs según tu JSON del backend
            const currentUserId = user?._id || user?.id;
            const recordUserId = item.userId; // El backend envía userId directamente
            
            const isMe = currentUserId && recordUserId && String(currentUserId) === String(recordUserId);
            
            // Fallback para el nombre si el objeto user no viene poblado
            const userName = item.user?.name || (isMe ? user?.name : 'Atleta');
            const userLastName = item.user?.lastname || (isMe ? user?.lastname : 'EvoluFit');

            return (
              <article 
                key={`${item._id}-${index}`} 
                className={`${styles.row} ${isMe ? styles.isMe : ''}`}
              >
                <div className={styles.exerciseInfo}>
                  <strong>{item._id}</strong>
                  <small>{item.muscleGroup}</small>
                </div>
                
                <div className={styles.userInfo}>
                  <div className={`${styles.avatar} ${isMe ? styles.avatarMe : ''}`}>
                    {userName[0]}{userLastName[0]}
                  </div>
                  <span>
                    {userName} {userLastName} 
                    {isMe && <b className={styles.meTag}> (Tú)</b>}
                  </span>
                </div>

                <div className={styles.weightInfo}>
                  <span className={styles.weightValue}>
                    {Math.round(item.maxWeight)} <b>Kg</b>
                  </span>
                  <p className={isMe ? styles.myStatus : styles.statusText}>
                    {isMe ? '¡Tu mejor marca! 🔥' : 'Récord a batir ⚡'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {hasNextPage && (
          <div className={styles.loadMoreWrapper}>
            <button 
              onClick={handleLoadMore} 
              disabled={loadingMore}
              className={styles.loadMoreBtn}
            >
              {loadingMore ? 'Cargando guerreros...' : 'Ver más récords ↓'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};