import React, { useId } from 'react';
import { useCountUp } from 'react-countup';
import { useMediasQuerys } from '../hooks/useMediasQuerys';
import styles from './PerformanceStats.module.scss';

/**
 * PERFORMANCE STATS COMPONENT
 * Renderiza métricas clave de éxito con contadores animados.
 * Utiliza Intersection Observer (vía scrollSpy) para disparar las animaciones 
 * solo cuando el componente entra en el viewport.
 */
export const PerformanceStats = () => {
  const { isDesktop, isTablet } = useMediasQuerys();

  // IDs únicos para vinculación de refs de animación
  const statYearsId = useId();
  const statTrainersId = useId();
  const statMembersId = useId();
  const statServiceId = useId();

  const containerClass = isDesktop 
    ? styles.containerDesktop 
    : isTablet 
      ? styles.containerTablet 
      : styles.containerMobile;

  return (
    <div className={`${styles.performanceStats} ${containerClass}`}>
      
      <div className={styles.performanceStats__statCard}>
        <CountUpNumber id={statYearsId} end={12} suffix="+" />
        <span>Años de Servicio</span> 
      </div>

      <div className={styles.performanceStats__statCard}>
        <CountUpNumber id={statTrainersId} end={10} suffix="+" /> 
        <span>Entrenadores Certificados</span> 
      </div>

      <div className={styles.performanceStats__statCard}>
        <CountUpNumber id={statMembersId} end={786} suffix="+" /> 
        <span>Miembros Felices</span> 
      </div>

      <div className={styles.performanceStats__statCard}>
        <CountUpNumber id={statServiceId} end={95} suffix="%" /> 
        <span>Satisfacción al Cliente</span> 
      </div>

    </div>
  );
};

/**
 * COUNTUP NUMBER HELPER
 * Componente interno que encapsula la lógica de animación de números.
 */
const CountUpNumber = ({ id, end, suffix = "" }) => {
  useCountUp({ 
    ref: id, 
    end, 
    duration: 2.5, // Un poco más lento para mejorar la fluidez visual
    suffix: suffix, 
    enableScrollSpy: true, 
    scrollSpyOnce: true // La animación solo se ejecuta la primera vez que se ve
  });
  
  return (
    <p 
      id={id} 
      className={styles.statValue}
      aria-label={`${end}${suffix}`} // Accesibilidad para lectores de pantalla
    ></p>
  );
};