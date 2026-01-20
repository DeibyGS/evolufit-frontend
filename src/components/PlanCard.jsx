import React from 'react';
import styles from './PlanCard.module.scss';
import dataPrices from '../data/dataPrices.json';

export const PlanCard = () => {
  return (
    <section className={styles.sectionPlans} id="prices">
      <div className={styles.plansHeader}>
        <h2>Elige tu <span>Nivel</span></h2>
        <p>Desbloquea tu máximo potencial con nuestros planes de entrenamiento.</p>
      </div>

      <div className={styles.cardsGrid}>
        {dataPrices.map((data) => {
          // Lógica para detectar el plan recomendado (ej. por precio o ID)
          const isRecommended = data.price > 20 && data.price < 50;
          
          return (
            <div 
              key={data.id} 
              className={`${styles.planCard} ${isRecommended ? styles.recommended : ''}`}
            >
              {isRecommended && (
                <div className={styles.popularBadge}>Más Popular</div>
              )}
              
              <div className={styles.cardHeader}>
                <h3>{data.title}</h3>
                <div className={styles.priceContainer}>
                  <p className={styles.planPrice}>{data.price}</p>
                  <span className={styles.currency}>/mes</span>
                </div>
              </div>

              <span className={styles.planDescription}>
                {data.description}
              </span>

              <ul className={styles.featuresList}>
                {data.features.map((feature, index) => (
                  <li key={index}>
                    <span className={styles.checkIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={styles.btnPlan}>
                Seleccionar {data.title}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};