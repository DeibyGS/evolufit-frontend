import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './HeaderAuthButton.module.scss'
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

export const HeaderAuthButton = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate(); 

  const handleClick = () => {
    if (isAuthenticated) {
      logout();
      toast.success("Has cerrado sesión correctamente.");
      navigate("/"); 
    } else {
      navigate("/auth"); 
    }
  };
  
  return (
    <button className={styles.authButton} onClick={handleClick}>
      {isAuthenticated ? (
        <>Cerrar Sesión 🚪</>
      ) : (
        <>Únete Ahora ⚡</>
      )}
    </button>      
  );
}