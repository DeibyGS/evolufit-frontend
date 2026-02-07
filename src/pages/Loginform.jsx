import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from './LoginForm.module.scss';
import { toast } from 'sonner';
import { BASE_URL } from '../api/API';
import { FullPageLoader } from '../components/FullPageLoader';

/**
 * COMPONENTE: LoginForm - Versión Optimizada
 * Gestión de autenticación con sanitización de inputs y manejo de errores proactivo.
 */
export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [errors, setErrors] = useState({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  /**
   * Manejador de cambios en los inputs
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrors({}); // Limpiamos errores previos

  // 1. Sanitización (Vital para evitar fallos por mayúsculas/espacios)
  const loginPayload = {
    email: formData.email.trim().toLowerCase(),
    password: formData.password
  };

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    });
    
    const data = await res.json();

    if (!res.ok) {
      // Caso A: Errores de validación de Zod (ej. formato de email inválido)
      if (data.errors && Array.isArray(data.errors)) {
        const apiErrors = {};
        data.errors.forEach(err => { 
          if (err.path) apiErrors[err.path] = err.message; 
        });
        setErrors(apiErrors);
        toast.error('Corrige los campos marcados');
      } 
      // Caso B: Error de credenciales (401, 404) o errores genéricos
      else {
        toast.error(data.message || 'Credenciales incorrectas');
      }
      
      setIsLoading(false);
      return; // Detenemos la ejecución
    }

    // --- ÉXITO ---
    toast.success(`¡Bienvenido de nuevo, ${data.user.name}!`);
    
    // 3. Persistencia en el store global (Zustand)
    login(data.user, data.token); 
    
    // 4. Redirección
    navigate('/dashboard'); 
    
    // Nota: No es estrictamente necesario hacer setIsLoading(false) aquí 
    // porque el componente se desmontará al navegar.
  } catch (error) {
    // 5. Manejo de errores de red o servidor apagado
    console.error("🔥 Login Error:", error);
    toast.error('Error de conexión. El servidor podría estar reiniciándose.');
    setIsLoading(false);
  }
};

  return (
    <div className={styles.loginContainer}>
      {/* Feedback visual de carga para mitigar la latencia del servidor */}
      {isLoading && <FullPageLoader />} 
      
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <h2>Iniciar Sesión</h2>
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
            required
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            autoComplete="current-password"
            required
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          
        </div>

        <div className={styles.forgotPassword}>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'VERIFICANDO...' : 'ENTRAR A EVOLUTFIT'}
        </button>

        <div className={styles.footerLinks}>
          <span>¿Aún no eres parte del equipo? </span>
          <Link to="/register" className={styles.registerLink}>
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
};