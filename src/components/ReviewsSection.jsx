import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import reviewsData from '../data/reviewsData.json';
import styles from './ReviewsSection.module.scss';
import { useMediasQuerys } from '../hooks/useMediasQuerys';

/**
 * COMPONENTE: ReviewsSection (Carrusel de Testimonios)
 * @description
 * Despliega las reseñas de los usuarios mediante un carrusel dinámico e interactivo.
 * Su objetivo es generar confianza (Social Proof) mediante la exposición de 
 * experiencias reales de la comunidad EvolutFit.
 * * @técnico
 * - Integración con 'react-slick' para la lógica del slider.
 * - Sincronización de configuración del slider con el hook 'useMediasQuerys'.
 * - Carga de datos externa mediante archivo JSON para facilitar el mantenimiento.
 * - Animaciones personalizadas mediante transiciones de curva Bézier.
 */
export const ReviewsSection = () => {
  /** * Hook personalizado para la gestión de breakpoints.
   * Permite que el slider cambie el número de tarjetas visibles en tiempo real.
   */
  const { isDesktop, isTablet, isMobile } = useMediasQuerys();

  /**
   * CONFIGURACIÓN DEL SLIDER (Slick Settings)
   * Define el comportamiento del carrusel según las capacidades del hardware y el viewport.
   */
  const settings = {
    dots: true,               // Navegación por puntos inferior
    infinite: true,           // Bucle infinito de diapositivas
    speed: 800,               // Velocidad de la transición (ms)
    // Lógica dinámica: 3 cards en Desktop, 2 en Tablet, 1 en Mobile
    slidesToShow: isDesktop ? 3 : isTablet ? 2 : 1,
    slidesToScroll: 1,
    autoplay: true,           // Reproducción automática para mejorar el engagement
    autoplaySpeed: 5000,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)", // Transición premium
    centerMode: !isMobile,    // Resalta la card central en pantallas grandes
    centerPadding: "0px",
  };

  /** Clase dinámica para el contenedor basada en el media query activo */
  const containerClass = isDesktop 
    ? styles.containerDesktop 
    : isTablet 
      ? styles.containerTablet 
      : styles.containerMobile;

  return (
    <section id="reviews" className={`${styles.sectionReviews} ${containerClass}`}>
      {/* Encabezado de la sección con énfasis de marca */}
      <div className={styles.header}>
        <h2>Lo que nuestra <span>Comunidad</span> dice</h2>
        <p>Resultados reales de miembros reales que ya forman parte de la familia EvolutFit.</p>
      </div>

      <div className={styles.sliderWrapper}>
        {/* Desestructuración de settings para inicializar el componente Slider */}
        <Slider {...settings}>
          {reviewsData.map((d, index) => (
            <div key={index} className={styles.cardContainer}>
              <article className={styles.reviewCard}>
                
                {/* Visualización de valoración mediante caracteres Unicode */}
                <div className={styles.stars}>
                  {"★".repeat(d.rating || 5)}{"☆".repeat(5 - (d.rating || 5))}
                </div>
                
                {/* Cuerpo de la reseña con diseño de cita textual */}
                <p className={styles.reviewText}>
                  <span className={styles.quoteMark}>&ldquo;</span>
                  {d.content}
                  <span className={styles.quoteMark}>&rdquo;</span>
                </p>

                {/* Bloque de identidad del autor: Avatar + Datos personales */}
                <div className={styles.authorInfo}>
                  <div className={styles.avatar}>
                    {/* Generación de avatar por inicial en ausencia de imagen */}
                    {d.name ? d.name.charAt(0) : 'E'}
                  </div>
                  <div className={styles.details}>
                    <strong className={styles.name}>{d.name || "Anónimo"}</strong>
                    <span className={styles.role}>{d.role || "Miembro"}</span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};