import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import styles from './HeaderAuthButton.module.scss';

/**
 * HEADER AUTH BUTTON COMPONENT
 * Botón dinámico que gestiona el punto de entrada/salida de la sesión.
 * Utiliza Zustand para sincronizar el estado de autenticación en toda la App.
 */
export const HeaderAuthButton = () => {
  // Suscripción selectiva al store de autenticación
  const { logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate(); 

  /**
   * Manejador de eventos híbrido:
   * Determina la acción (Logout o Navegación) basándose en el estado global.
   */
  const handleClick = () => {
    if (isAuthenticated) {
      // Flujo de cierre de sesión
      logout();
      toast.success("Has cerrado sesión correctamente.");
      navigate("/"); 
    } else {
      // Flujo de acceso
      navigate("/auth"); 
    }
  };
  
  return (
    <button 
      className={styles.authButton} 
      onClick={handleClick}
      aria-label={isAuthenticated ? "Cerrar sesión" : "Ir al registro"}
    >
      {isAuthenticated ? (
        <>Cerrar Sesión 🚪</>
      ) : (
        <>Únete Ahora ⚡</>
      )}
    </button>      
  );
};