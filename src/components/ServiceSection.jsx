import React, { useRef, useEffect, useState } from 'react';
import styles from './ServiceSection.module.scss';

/**
 * SERVICE SECTION COMPONENT
 * Presenta los pilares de la plataforma con una animación de entrada (reveal).
 * Utiliza Intersection Observer para disparar transiciones de CSS optimizadas.
 */
export const ServiceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Configuración del observador: detecta visibilidad en el viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optimización: dejamos de observar tras la primera activación
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.15, // Activación al 15% de visibilidad
        rootMargin: '0px 0px -50px 0px' // Margen de seguridad para el disparo
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className={`${styles.containerServices} ${isVisible ? styles.reveal : styles.hidden}`}
      aria-labelledby="services-title"
    >
      <header className={styles.header}>
        <h2 id="services-title" className={styles.mainTitle}>
          Por Qué <span>Elegirnos</span>
        </h2>
        <p className={styles.mainDescription}>
          Combinamos tecnología de vanguardia con metodologías de entrenamiento probadas 
          para que cada gota de sudor cuente hacia tus objetivos.
        </p>
      </header>
      
      <div className={styles.serviceContent}>
        <div className={styles.gridItems}>
          
          <article className={styles.serviceItem}>
            <div className={styles.iconBox}>
              <img src="Group21.png" alt="" aria-hidden="true" />
            </div>
            <h3>Entrenamiento Personalizado</h3>
            <p>
              Diseña y sigue rutinas adaptadas a tus metas. Desde fuerza pura hasta resistencia extrema.
            </p>
          </article>

          <article className={styles.serviceItem}>
            <div className={styles.iconBox}>
              <img src="Group22.png" alt="" aria-hidden="true" />
            </div>
            <h3>Sobrecarga Progresiva</h3>
            <p>
              Registra cada levantamiento y analiza tu evolución con métricas precisas y gráficos interactivos.
            </p>
          </article>

          <article className={styles.serviceItem}>
            <div className={styles.iconBox}>
              <img src="Group23.png" alt="" aria-hidden="true" />
            </div>
            <h3>Historial de Logros</h3>
            <p>
              Tu progreso no se pierde. Mantén un diario detallado de cada victoria en tu camino al éxito.
            </p>
          </article>

          <article className={styles.serviceItem}>
            <div className={styles.iconBox}>
              <img src="Group24.png" alt="" aria-hidden="true" />
            </div>
            <h3>Reportes Visuales</h3>
            <p>
              Toma decisiones inteligentes basadas en datos reales. Gráficos de rendimiento a tu disposición.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};