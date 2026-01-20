import React from 'react';
import styles from './Footer.module.scss';

/**
 * FOOTER COMPONENT
 * Renderiza el pie de página de la aplicación.
 * La responsividad se gestiona íntegramente mediante CSS Modules (Flexbox/Grid),
 * evitando hooks de JS innecesarios para mejorar el rendimiento.
 */
export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        
        {/* COLUMNA 1: IDENTIDAD */}
        <div className={styles.footer__brand}>
          <h2 className={styles.logo}>Evolut<span>Fit</span></h2>
          <p className={styles.tagline}>Elevando tus límites, repetición a repetición.</p>
        </div>

        {/* COLUMNA 2: NAVEGACIÓN RÁPIDA */}
        <div className={styles.footer__links}>
          <h4>Explorar</h4>
          <nav>
            <ul>
              <li><a href="#services">Servicios</a></li>
              <li><a href="#prices">Planes</a></li>
              <li><a href="#reviews">Comunidad</a></li>
            </ul>
          </nav>
        </div>

        {/* COLUMNA 3: CONTEXTO ACADÉMICO */}
        <div className={styles.footer__academic}>
          <h4>Desarrollo Full Stack</h4>
          <p>
            Plataforma diseñada y desarrollada como <strong>Proyecto Final de Máster</strong>,
            especialidad Web Full Stack. Implementando arquitectura MERN completa.
          </p>
          <span className={styles.practiceBadge}>MERN Stack Project</span>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: COPYRIGHT Y CRÉDITOS */}
      <div className={styles.footer__bottom}>
        <div className={styles.divider}></div>
        <div className={styles.bottomContent}>
          <p>© {new Date().getFullYear()} EvolutFit. Todos los derechos reservados.</p>
          
          <p className={styles.author}>
            Desarrollado como Proyecto Final de Máster Web por{" "}
            <a 
              href="https://www.linkedin.com/in/deibygorrin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.authorLink}
            >
              <strong>Deiby Gorrin</strong>
            </a>
          </p>        
        </div>
      </div>
    </footer>
  );
};