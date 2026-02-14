import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BASE_URL } from '../api/API'; // Asegúrate de que la ruta a tu API sea correcta
import styles from './ForgotPassword.module.scss';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Petición real al backend
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      const data = await response.json();

      if (response.ok) {
        // Éxito: El backend generó el token y envió el mail
        toast.success('¡Enlace enviado! Revisa tu bandeja de entrada.');
        setIsSent(true);
      } else {
        // Error controlado (ej: el usuario no existe o fallo de red)
        toast.error(data.message || 'No se pudo procesar la solicitud.');
      }
    } catch (error) {
      console.error('Error en ForgotPassword:', error);
      toast.error('Error de conexión. Inténtalo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        {/* Eliminamos el badge de WIP para una experiencia profesional */}
        <h2>Recuperar Contraseña</h2>
        
        {!isSent ? (
          <>
            <p className={styles.description}>
              Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Enlace'}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.iconCheck}>✉️</div>
            <p>Hemos enviado un enlace de recuperación a: <strong>{email}</strong></p>
            <p className={styles.smallText}>Si no lo recibes en unos minutos, revisa tu carpeta de spam.</p>
            <button 
              className={styles.backBtn} 
              onClick={() => setIsSent(false)}
            >
              Intentar con otro correo
            </button>
          </div>
        )}

        <div className={styles.footer}>
          <Link to="/auth">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};