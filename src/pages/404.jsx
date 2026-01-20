import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './404.module.scss';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>4<span>0</span>4</h1>
        
        <div className={styles.messageGroup}>
          <h2>¡Ups! Te has salido de la <span>rutina</span></h2>
          <p>
            La página que buscas no existe o ha sido movida a otro rack. 
            No dejes que esto arruine tu entrenamiento.
          </p>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.primaryBtn} 
            onClick={() => navigate('/dashboard')}
          >
            VOLVER AL DASHBOARD
          </button>
          <button 
            className={styles.secondaryBtn} 
            onClick={() => navigate("/")}
          >
            REGRESAR
          </button>
        </div>
      </div>
      
      {/* Decoración de fondo sutil */}
      <div className={styles.bgDecoration}></div>
    </div>
  );
};