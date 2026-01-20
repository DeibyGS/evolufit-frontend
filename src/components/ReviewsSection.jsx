import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import reviewsData from '../data/reviewsData.json';
import styles from './ReviewsSection.module.scss';
import { useMediasQuerys } from '../hooks/useMediasQuerys';

export const ReviewsSection = () => {
  const { isDesktop, isTablet, isMobile } = useMediasQuerys();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    // Sincronizado con tus hooks de media queries
    slidesToShow: isDesktop ? 3 : isTablet ? 2 : 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
    centerMode: !isMobile, 
    centerPadding: "0px",
  };

  // Determinamos la clase de contenedor según el dispositivo
  const containerClass = isDesktop 
    ? styles.containerDesktop 
    : isTablet 
      ? styles.containerTablet 
      : styles.containerMobile;

  return (
    <section id="reviews" className={`${styles.sectionReviews} ${containerClass}`}>
      <div className={styles.header}>
        <h2>Lo que nuestra <span>Comunidad</span> dice</h2>
        <p>Resultados reales de miembros reales que ya forman parte de la familia EvolutFit.</p>
      </div>

      <div className={styles.sliderWrapper}>
        <Slider {...settings}>
          {reviewsData.map((d, index) => (
            <div key={index} className={styles.cardContainer}>
              <article className={styles.reviewCard}>
                <div className={styles.stars}>
                  {"★".repeat(d.rating || 5)}{"☆".repeat(5 - (d.rating || 5))}
                </div>
                
                <p className={styles.reviewText}>
                  <span className={styles.quoteMark}>&ldquo;</span>
                  {d.content}
                  <span className={styles.quoteMark}>&rdquo;</span>
                </p>

                <div className={styles.authorInfo}>
                  <div className={styles.avatar}>
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