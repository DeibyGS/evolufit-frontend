import React from 'react';
import styles from './Hero.module.scss';
import { PerformanceStats } from './PerformanceStats.jsx';
import { useMediasQuerys } from '../hooks/useMediasQuerys';
import { useAuthStore } from '../store/authStore';

/**
 * HERO COMPONENT
 * La pieza central de la Landing Page. Gestiona el primer impacto visual,
 * adaptando su estructura y dimensiones dinámicamente según el dispositivo detectado.
 */
export const Hero = () => {
  const { isDesktop, isTablet } = useMediasQuerys();
  
  // Suscripción selectiva al estado de autenticación
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  /**
   * Determinación de clase por Viewport:
   * Permite ajustes de padding y altura específicos que las media-queries
   * estándar a veces no cubren con la misma precisión que los hooks de React.
   */
  const containerClass = isDesktop 
    ? styles.containerDesktop 
    : isTablet 
      ? styles.containerTablet 
      : styles.containerMobile;

  return (
    <section className={`${styles.hero} ${containerClass}`}>
      
      {/* CAPA 1: BACKGROUND LAYER
          Gestiona la imagen de fondo y el overlay de legibilidad */}
      <div className={styles.hero__imageWrapper}>
        <img 
          className={styles.hero__imgHero} 
          src="Hero.png" 
          alt="Fondo EvolutFit - Transformación Fitness" 
        />
        {/* Overlay con degradado para asegurar el contraste del texto (A11y) */}
        <div className={styles.hero__overlay}></div>
      </div>

      {/* CAPA 2: CONTENT LAYER
          Jerarquía tipográfica y Call to Action principal */}
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

          {/* Espacio reservado para acciones dinámicas (ej. Botón de inicio) */}
        </div>
      </div>

      {/* CAPA 3: INTERACTIVE STATS
          Componente desacoplado que maneja las métricas animadas */}
      <div className={styles.hero__stats}>
        <PerformanceStats />
      </div>
    </section>
  );
};