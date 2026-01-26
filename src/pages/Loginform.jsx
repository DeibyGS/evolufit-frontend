import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from './LoginForm.module.scss';
import { toast } from 'sonner';
import { BASE_URL } from '../api/API';
import { FullPageLoader } from '../components/FullPageLoader';

/**
 * COMPONENTE: LoginForm
 * * Gestiona la autenticación de usuarios en la plataforma EvolutFit.
 * * @description
 * Este componente captura las credenciales del usuario, realiza la petición 
 * de autenticación al backend y gestiona el estado global de la sesión.
 * Incluye un manejo de UX mediante un loader de pantalla completa para
 * mitigar el tiempo de espera por el 'cold start' del servidor en Render.
 */
export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  /** @state {boolean} isLoading - Controla la visibilidad del loader de pantalla completa durante la petición */
  const [isLoading, setIsLoading] = useState(false);
  
  /** @state {Object} formData - Almacena los valores de los campos del formulario */
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  /**
   * Actualiza el estado del formulario de forma dinámica.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio en el input.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Procesa el envío del formulario de inicio de sesión.
   * * @async
   * @param {React.FormEvent} e - Evento de envío del formulario.
   * @returns {Promise<void>} Redirige al dashboard en caso de éxito o muestra error mediante toast.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Petición asíncrona al endpoint de autenticación
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Feedback de éxito y actualización del store global (Zustand)
        toast.success(`¡Bienvenido de nuevo, ${data.user.name}!`);
        login(data.user, data.token);
        navigate('/dashboard');  
      } else {
        // Manejo de errores controlados por el backend (ej. contraseña incorrecta)
        toast.error(data.message || 'Credenciales incorrectas');
        setIsLoading(false);
      }
    } catch (error) {
      // Manejo de errores de red o servidor caído/despertando
      toast.error('Error de red: El servidor está despertando. Reintenta en unos segundos.');
      setIsLoading(false);
    } 
  };

  return (
    <div className={styles.loginContainer}>
      {/* Visualización condicional del loader para mejorar la UX */}
      {isLoading && <FullPageLoader />} 
      
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        {/* Grupo: Email */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        {/* Grupo: Contraseña */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            required
          />
        </div>

        <div className={styles.forgotPassword}>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>

        {/* Botón de acción principal con feedback de estado */}
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Conectando...' : 'Entrar'}
        </button>

        <div className={styles.footerLinks}>
          <span>¿No tienes cuenta? </span>
          <Link to="/register" className={styles.registerLink}>
            Crear cuenta
          </Link>
        </div>
      </form>
    </div>
  );
};