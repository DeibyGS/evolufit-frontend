import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import styles from './DashboardLayout.module.scss';

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada. ¡Vuelve pronto a entrenar!");
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className={styles.dashboardContainer}>
      {/* Botón hamburguesa con animación de X */}
      <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Abrir menú">
        <span className={isMenuOpen ? styles.iconOpen : ''}></span>
      </button>

      {/* Overlay para cerrar el menú al tocar fuera */}
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}

      <aside className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoSection}>
          <div className={styles.brand}>
            <h2>Evolut<span>Fit</span></h2>
            <img 
              className={styles.logoImg} 
              src="/evolutFitLogo.png" 
              alt='Logo EvolutFit' 
            />
            
          </div>
          
          <div className={styles.welcomeWrapper}>
            <p>Bienvenido,</p>
            <span className={styles.userName}>{user?.name} {user?.lastname}</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <div className={styles.navGroup}>
            <NavLink to="/dashboard" end onClick={closeMenu} className={({isActive}) => isActive ? styles.active : ''}>
               📈 Dashboard
            </NavLink>
            <NavLink to="/dashboard/routines" onClick={closeMenu} className={({isActive}) => isActive ? styles.active : ''}>
               ⚡ Rutinas
            </NavLink>
            <NavLink to="/dashboard/social" onClick={closeMenu} className={({isActive}) => isActive ? styles.active : ''}>
               🌐 Comunidad
            </NavLink>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.navGroup}>
            <NavLink to="/dashboard/leaderboard" onClick={closeMenu} className={({isActive}) => isActive ? styles.active : ''}>
               👑 Hall of Fame
            </NavLink>
            <NavLink to="/dashboard/achievements" onClick={closeMenu} className={({isActive}) => isActive ? styles.active : ''}>
               🏅 Mis Logros
            </NavLink>
            <NavLink to="/dashboard/rm-calculator" onClick={closeMenu} className={({isActive}) => isActive ? styles.active : ''}>
               💯 Máximos (1RM)
            </NavLink>
            <NavLink to="/dashboard/calculator" onClick={closeMenu} className={({isActive}) => isActive ? styles.active : ''}>
               🥗 Calculadora Fitness
            </NavLink>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.navGroup}>
            <NavLink to="/dashboard/profile" onClick={closeMenu} className={({isActive}) => isActive ? styles.active : ''}>
               👤 Mi Perfil
            </NavLink>
          </div>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar Sesión 🚪
        </button>
      </aside>

      <main className={styles.mainContent}>
        <Outlet /> 
      </main>
    </div>
  );
};