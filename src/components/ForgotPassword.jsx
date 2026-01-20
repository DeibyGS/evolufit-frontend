import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './ForgotPassword.module.scss';

/**
 * FORGOT PASSWORD COMPONENT
 * Maneja la lógica de recuperación de credenciales.
 * NOTA TÉCNICA: Esta funcionalidad se encuentra actualmente en fase de construcción 
 * (Frontend-Ready / Backend-Pending).
 */
export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // NOTA DE DESARROLLO: Función en construcción. 
    // Actualmente solo simula el flujo de éxito en el cliente.
    try {
      console.log('Simulando recuperación para:', email);
      
      // Aviso informativo sobre el estado del desarrollo
      toast.info('Función en desarrollo: El sistema de recuperación se habilitará próximamente.');
      
      // Simulamos la transición de estado para pruebas de UI/UX
      setIsSent(true);
    } catch (error) {
      toast.error('Hubo un problema. Inténtalo más tarde.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        {/* Badge informativo de funcionalidad en desarrollo */}
        <div className={styles.wipBadge}>Funcionalidad en Construcción</div>

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
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Enviar Enlace
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <p>✅ Flujo de prueba completado para: <strong>{email}</strong></p>
            <p>El envío real de correos electrónicos estará disponible en la próxima actualización.</p>
          </div>
        )}

        <div className={styles.footer}>
          <Link to="/auth">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};