import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './404.module.scss';

/**
 * COMPONENTE: NotFound (Página de Error 404)
 * @description
 * Este componente actúa como un "fallback" visual cuando un usuario intenta
 * acceder a una URL inexistente. Utiliza una narrativa orientada al fitness
 * para mantener la coherencia de marca y ofrece rutas de escape rápidas.
 * * @técnico
 * Se coloca al final de las rutas en App.js con el path="*" para capturar
 * cualquier acceso no definido en el sistema de navegación.
 */
export const NotFound = () => {
  /** Hook de React Router para gestionar la redirección programática */
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        {/* Encabezado visual del error 404 con énfasis en el color corporativo */}
        <h1 className={styles.errorCode}>4<span>0</span>4</h1>
        
        <div className={styles.messageGroup}>
          <h2>¡Ups! Te has salido de la <span>rutina</span></h2>
          <p>
            La página que buscas no existe o ha sido movida a otro rack. 
            No dejes que esto arruine tu entrenamiento.
          </p>
        </div>

        <div className={styles.actions}>
          {/* Acción principal: Redirección al área privada del usuario */}
          <button 
            className={styles.primaryBtn} 
            onClick={() => navigate('/dashboard')}
          >
            VOLVER AL DASHBOARD
          </button>

          {/* Acción secundaria: Retorno a la página de aterrizaje (Landing) */}
          <button 
            className={styles.secondaryBtn} 
            onClick={() => navigate("/")}
          >
            REGRESAR
          </button>
        </div>
      </div>
      
      {/* Elemento puramente decorativo para profundidad visual */}
      <div className={styles.bgDecoration}></div>
    </div>
  );
};