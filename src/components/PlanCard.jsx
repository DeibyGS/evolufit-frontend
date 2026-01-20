import React, { useRef, useEffect, useState } from 'react';
import styles from './PlanCard.module.scss';
import dataPrices from '../data/dataPrices.json';

/**
 * PLAN CARD COMPONENT
 * Renderiza la oferta comercial con animaciones de entrada controladas
 * por el scroll del usuario mediante Intersection Observer.
 */
export const PlanCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.1, // Se activa pronto para que el usuario vea la animación al empezar a bajar
        rootMargin: "0px 0px -50px 0px" // Margen inferior para disparar la animación un poco antes
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`${styles.sectionPlans} ${isVisible ? styles.reveal : styles.hidden}`} 
      id="prices"
    >
      <div className={styles.plansHeader}>
        <h2>Elige tu <span>Nivel</span></h2>
        <p>Desbloquea tu máximo potencial con nuestros planes de entrenamiento profesional.</p>
      </div>

      <div className={styles.cardsGrid}>
        {dataPrices.map((data) => {
          // Lógica de detección de plan popular
          const isRecommended = data.title.toLowerCase().includes('pro') || data.isPopular;
          
          return (
            <article 
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

              <p className={styles.planDescription}>
                {data.description}
              </p>

              <ul className={styles.featuresList}>
                {data.features.map((feature, index) => (
                  <li key={index}>
                    <span className={styles.checkIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <footer className={styles.cardFooter}>
                <button className={styles.btnPlan}>
                  Comenzar con {data.title}
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
};