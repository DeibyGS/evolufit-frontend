import React from 'react';
import styles from './ContactSection.module.scss';
import { useMediasQuerys } from '../hooks/useMediasQuerys';

export const ContactSection = () => {
  const { isDesktop, isTablet, isMobile } = useMediasQuerys();

  const containerClass = isDesktop 
    ? styles.containerDesktop 
    : isTablet 
      ? styles.containerTablet 
      : styles.containerMobile;

  return (
    <section id="contact" className={`${styles.sectionContact} ${containerClass}`}>
      <div className={styles.sectionContact__overlay}>
        <img 
          src="imgSectionContact.png" 
          alt="Discos de gimnasio" 
          className={styles.sectionContact__img}
        />
        {/* Capa de color para asegurar legibilidad */}
        <div className={styles.overlayColor}></div>
      </div>

      <div className={styles.sectionContact__content}>
        <div className={styles.sectionContact__info}>
          <p>¿Listo para comenzar tu transformación?</p>
          <h3>Llámanos hoy mismo</h3>
          <a href="tel:+34910123456" className={styles.phoneNumber}>
            +34 910 123 456
          </a>
        </div>
      </div>
    </section>
  );
};