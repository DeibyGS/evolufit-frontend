import React from 'react';
import styles from './ContactSection.module.scss';
import { useMediasQuerys } from '../hooks/useMediasQuerys';

/**
 * COMPONENTE: ContactSection
 * @description
 * Sección de "Call to Action" (CTA) diseñada para facilitar el contacto directo.
 * Presenta un diseño de alto impacto visual con una imagen de fondo optimizada
 * y un sistema de respuesta dinámica basado en breakpoints de JavaScript.
 * * @técnico
 * - Utiliza el custom hook 'useMediasQuerys' para gestionar el renderizado responsivo.
 * - Implementa una arquitectura de capas (Image + Overlay) para garantizar el contraste del texto.
 * - Uso de CSS Modules para el encapsulamiento de estilos y manejo de estados Desktop/Tablet/Mobile.
 */
export const ContactSection = () => {
  /** * Hook personalizado para detectar el ancho de la ventana.
   * Permite inyectar clases de CSS específicas según el dispositivo.
   */
  const { isDesktop, isTablet, isMobile } = useMediasQuerys();

  /** * Lógica de asignación de clases dinámica basada en el estado del Viewport.
   */
  const containerClass = isDesktop 
    ? styles.containerDesktop 
    : isTablet 
      ? styles.containerTablet 
      : styles.containerMobile;

  return (
    <section id="contact" className={`${styles.sectionContact} ${containerClass}`}>
      {/* CONTENEDOR DE FONDO: Maneja la imagen y el tratamiento visual */}
      <div className={styles.sectionContact__overlay}>
        <img 
          src="imgSectionContact.png" 
          alt="Discos de gimnasio" 
          className={styles.sectionContact__img}
        />
        {/* Capa de oscurecimiento (Overlay) para optimizar la legibilidad del texto blanco */}
        <div className={styles.overlayColor}></div>
      </div>

      {/* CONTENEDOR DE TEXTO: Mensaje motivacional y enlace de acción (CTA) */}
      <div className={styles.sectionContact__content}>
        <div className={styles.sectionContact__info}>
          <p>¿Listo para comenzar tu transformación?</p>
          <h3>Llámanos hoy mismo</h3>
          
          {/* Enlace de tipo 'tel' para integración directa con dialers telefónicos en dispositivos móviles */}
          <a href="tel:+34910123456" className={styles.phoneNumber}>
            +34 910 123 456
          </a>
        </div>
      </div>
    </section>
  );
};