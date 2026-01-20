import React, { useId } from 'react'
import styles from './PerformanceStats.module.scss'
import { useCountUp } from 'react-countup';
import { useMediasQuerys } from '../hooks/useMediasQuerys';

export const PerformanceStats = () => {

    const { isDesktop, isTablet } = useMediasQuerys();

    const statYearsId = useId();
    const statTrainersId = useId();
    const statMembersId = useId();
    const statServiceId = useId();

  return (
    <div className={`${styles.performanceStats} ${isDesktop ? styles.containerDesktop : isTablet ? styles.containerTablet : styles.containerMobile}`}>        
        <div className={styles.performanceStats__statCard}>
          <CountUpNumber id={statYearsId} end={12} suffix='+'/>
          <span>Años de Servicio</span> 
        </div>
        <div className={styles.performanceStats__statCard}>
          <CountUpNumber id={statTrainersId} end={10} suffix='+' /> 
          <span>Entrenadores Certificados</span> 
        </div>
        <div className={styles.performanceStats__statCard}>
          <CountUpNumber id={statMembersId} end={786} suffix='+'/> 
          <span>Miembros Felices</span> 
        </div>
        <div className={styles.performanceStats__statCard}>
          <CountUpNumber id={statServiceId} end={95} suffix='%'/> 
          <span>Satisfacción al Cliente</span> 
        </div>
    </div>
  )
}

const CountUpNumber = ({ id, end, suffix = "" }) => {
  useCountUp({ 
    ref: id, 
    end, 
    duration: 2, 
    suffix: suffix, 
    enableScrollSpy: true, 
    scrollSpyOnce: true 
  });
  
  return (
    <p id={id}></p>
  );
};