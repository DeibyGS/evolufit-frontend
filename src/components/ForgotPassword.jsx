import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './ForgotPassword.module.scss';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Aquí iría tu llamada al backend
    try {
      // Simulación de fetch
      console.log('Enviando recuperación a:', email);
      toast.success('Si el correo existe, recibirás instrucciones pronto');
      setIsSent(true);
    } catch (error) {
      toast.error('Hubo un problema. Inténtalo más tarde.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
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
            <p>✅ Hemos enviado un correo a <strong>{email}</strong></p>
            <p>Revisa tu bandeja de entrada (y la carpeta de spam).</p>
          </div>
        )}

        <div className={styles.footer}>
          <Link to="/auth">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};