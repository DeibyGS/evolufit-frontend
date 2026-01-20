import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HeaderAuthButton } from './HeaderAuthButton.jsx';
import { useMediasQuerys } from '../hooks/useMediasQuerys.jsx';
import styles from './Header.module.scss';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDesktop } = useMediasQuerys();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Lógica de Scroll mejorada: 
  // Ahora detecta si ya estás en la Home para hacer scroll directo o si debe navegar primero
  const handleScrollNav = (e, targetId) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname === "/") {
      // Si ya estás en Home, haz scroll suave
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Si estás en otra ruta (ej. Login), navega a Home con el hash
      navigate(`/#${targetId}`);
    }
  };

  useEffect(() => {
    // Si la URL cambia y tiene un hash, hacemos scroll (útil al venir de otra página)
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150); // Un pelín más de tiempo para asegurar que el DOM cargó
    }
  }, [location]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* LOGO */}
        <div className={styles.logoSection} onClick={() => { navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
          <h1 className={styles.title}>Evolut<span>Fit</span></h1>
          <img className={styles.logoImg} src="diagrama.png" alt='Logo EvolutFit' />
        </div>

        {/* OVERLAY MOBILE: Se renderiza siempre para la transición CSS o condicionalmente */}
        <div className={`${styles.overlay} ${isMenuOpen ? styles.overlayVisible : ''}`} onClick={closeMenu}></div>

        {/* NAVEGACIÓN */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navActive : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive && location.hash === "" ? styles.activeLink : ""}
            onClick={(e) => {
              if(location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({top: 0, behavior: 'smooth'});
              }
              closeMenu();
            }}
          >
            Home
          </NavLink>
          
          <a href="#services" onClick={(e) => handleScrollNav(e, "services")}>Servicios</a>
          <a href="#prices" onClick={(e) => handleScrollNav(e, "prices")}>Precios</a>
          <a href="#reviews" onClick={(e) => handleScrollNav(e, "reviews")}>Reseñas</a>
          <a href="#contact" onClick={(e) => handleScrollNav(e, "contact")}>Contacto</a>
          
          <div className={styles.authWrapper}>
            <HeaderAuthButton />
          </div>
        </nav>

        {/* BOTÓN HAMBURGUESA */}
        {!isDesktop && (
          <button 
            className={styles.mobileToggle} 
            onClick={toggleMenu} 
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
          >
            <span className={isMenuOpen ? styles.iconOpen : ''}></span>
          </button>
        )}
      </div>
    </header>
  );
};