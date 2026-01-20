import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HeaderAuthButton } from './HeaderAuthButton.jsx';
import { useMediasQuerys } from '../hooks/useMediasQuerys.jsx';
import styles from './Header.module.scss';

/**
 * HEADER COMPONENT
 * Gestiona la navegación principal, el scroll inteligente entre rutas
 * y el estado del menú colapsable en dispositivos móviles.
 */
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDesktop } = useMediasQuerys();
  const navigate = useNavigate();
  const location = useLocation();

  // Handlers para el estado del menú UI
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  /**
   * Lógica de Navegación Híbrida:
   * Si el usuario está en Home, realiza un Smooth Scroll.
   * Si está fuera, navega a Home incluyendo el Hash en la URL.
   */
  const handleScrollNav = (e, targetId) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname === "/") {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Redirección con hash para que el useEffect posterior maneje el scroll
      navigate(`/#${targetId}`);
    }
  };

  /**
   * Observer de Localización:
   * Detecta cambios en el hash de la URL para disparar el scroll tras la navegación.
   */
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // El timeout garantiza que el DOM de la Home esté montado antes de intentar el scroll
      const timeoutId = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150); 
      
      return () => clearTimeout(timeoutId); // Clean-up para evitar fugas de memoria
    }
  }, [location]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        
        {/* SECCIÓN LOGO: Acceso directo al top de la página */}
        <div 
          className={styles.logoSection} 
          onClick={() => { 
            navigate('/'); 
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
          }}
        >
          <h1 className={styles.title}>Evolut<span>Fit</span></h1>
          <img className={styles.logoImg} src="diagrama.png" alt='Logo EvolutFit' />
        </div>

        {/* OVERLAY: Fondo oscurecido para enfoque táctil en móvil */}
        <div 
          className={`${styles.overlay} ${isMenuOpen ? styles.overlayVisible : ''}`} 
          onClick={closeMenu}
        ></div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navActive : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive && location.hash === "" ? styles.activeLink : "")}
            onClick={(e) => {
              if(location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* MENÚ HAMBURGUESA: Solo visible en breakpoints no-desktop */}
        {!isDesktop && (
          <button 
            className={styles.mobileToggle} 
            onClick={toggleMenu} 
            aria-label="Alternar menú de navegación"
            aria-expanded={isMenuOpen}
          >
            <span className={isMenuOpen ? styles.iconOpen : ''}></span>
          </button>
        )}
      </div>
    </header>
  );
};