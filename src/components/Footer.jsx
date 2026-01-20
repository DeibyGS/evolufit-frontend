import React from 'react';
import styles from './Footer.module.scss';
import { useMediasQuerys } from '../hooks/useMediasQuerys';

export const Footer = () => {
  const { isMobile } = useMediasQuerys();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        
        {/* COLUMNA 1: BRANDING */}
        <div className={styles.footer__brand}>
          <h2 className={styles.logo}>Evolut<span>Fit</span></h2>
          <p className={styles.tagline}>Elevando tus límites, repetición a repetición.</p>
        </div>

        {/* COLUMNA 2: ENLACES RÁPIDOS */}
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

        {/* COLUMNA 3: NOTA ACADÉMICA (ACTUALIZADA) */}
        <div className={styles.footer__academic}>
          <h4>Desarrollo Full Stack</h4>
          <p>
            Plataforma diseñada y desarrollada como <strong>Proyecto Final de Máster</strong>,
            especialidad Web Full Stack. Implementando arquitectura MERN completa.
          </p>
          <span className={styles.practiceBadge}>MERN Stack Project</span>
        </div>
      </div>

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