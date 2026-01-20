import React from 'react';
import styles from './ServiceSection.module.scss';

export const ServiceSection = () => {
  return (
    <div id="services" className={styles.containerServices}>
      <header className={styles.header}>
        <h3 className={styles.mainTitle}>Por Qué <span>Elegirnos</span></h3>
        <p className={styles.mainDescription}>
          Combinamos tecnología de vanguardia con metodologías de entrenamiento probadas 
          para que cada gota de sudor cuente hacia tus objetivos.
        </p>
      </header>
      
      <section className={styles.serviceContent}>
        <div className={styles.gridItems}>
          
          <div className={styles.serviceItem}>
            <div className={styles.iconBox}>
              <img src="Group21.png" alt='Entrenamiento' />
            </div>
            <h3>Entrenamiento Personalizado</h3>
            <p>
              Diseña y sigue rutinas adaptadas a tus metas. Desde fuerza pura hasta resistencia extrema.
            </p>
          </div>

          <div className={styles.serviceItem}>
            <div className={styles.iconBox}>
              <img src="Group22.png" alt='Progreso' />
            </div>
            <h3>Sobrecarga Progresiva</h3>
            <p>
              Registra cada levantamiento y analiza tu evolución con métricas precisas y gráficos interactivos.
            </p>
          </div>

          <div className={styles.serviceItem}>
            <div className={styles.iconBox}>
              <img src="Group23.png" alt='Logros' />
            </div>
            <h3>Historial de Logros</h3>
            <p>
              Tu progreso no se pierde. Mantén un diario detallado de cada victoria en tu camino al éxito.
            </p>
          </div>

          <div className={styles.serviceItem}>
            <div className={styles.iconBox}>
              <img src="Group24.png" alt='Analítica' />
            </div>
            <h3>Reportes Visuales</h3>
            <p>
              Toma decisiones inteligentes basadas en datos reales. Gráficos de rendimiento a tu disposición.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};