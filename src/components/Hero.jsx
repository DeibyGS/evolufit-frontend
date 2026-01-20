import React from 'react';
import styles from './Hero.module.scss';
import { PerformanceStats } from './PerformanceStats.jsx';
import { HeaderAuthButton } from './HeaderAuthButton.jsx';
import { useMediasQuerys } from '../hooks/useMediasQuerys';
import { useAuthStore } from '../store/authStore';

export const Hero = () => {
  const { isDesktop, isTablet } = useMediasQuerys();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const containerClass = isDesktop 
    ? styles.containerDesktop 
    : isTablet 
      ? styles.containerTablet 
      : styles.containerMobile;

  return (
    <section className={`${styles.hero} ${containerClass}`}>
      {/* CAPA 1: FONDO */}
      <div className={styles.hero__imageWrapper}>
        <img 
          className={styles.hero__imgHero} 
          src="Hero.png" 
          alt="Fondo EvolutFit" 
        />
        {/* Un degradado oscuro para que el texto resalte mejor sobre la imagen */}
        <div className={styles.hero__overlay}></div>
      </div>

      {/* CAPA 2: CONTENIDO PRINCIPAL */}
      <div className={styles.hero__main}>
        <div className={styles.hero__content}>
          <h2 className={styles.hero__title}>
            Transforma tu <span>Cuerpo</span>, <br />
            Evoluciona tu <span>Vida</span>
          </h2>
          
          <p className={styles.hero__description}>
            Únete a EvolutFit hoy y comienza un viaje diseñado a la medida de tus objetivos. 
            Nuestras herramientas inteligentes y programas personalizados te ayudarán a alcanzar resultados duraderos.
          </p>

         
        </div>
      </div>

      {/* CAPA 3: ESTADÍSTICAS */}
      <div className={styles.hero__stats}>
        <PerformanceStats />
      </div>
    </section>
  );
};