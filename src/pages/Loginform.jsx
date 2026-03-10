import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from './LoginForm.module.scss';
import { toast } from 'sonner';
import { BASE_URL } from '../api/API';
import { FullPageLoader } from '../components/FullPageLoader';

/**
 * COMPONENTE: LoginForm - EvoluFit Optimized
 * Gestión de autenticación con mapeo de errores Zod del backend.
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpieza reactiva de error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); 

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
        // Caso A: Errores de validación de Zod (Array de errores)
        if (data.errors && Array.isArray(data.errors)) {
          const apiErrors = {};
          data.errors.forEach(err => { 
            // Zod devuelve el campo en un array 'path'
            const fieldName = Array.isArray(err.path) ? err.path[0] : err.path;
            if (fieldName) apiErrors[fieldName] = err.message; 
          });
          setErrors(apiErrors);
          toast.error('Revisa los datos ingresados');
        } 
        // Caso B: Credenciales incorrectas o errores de lógica
        else {
          toast.error(data.message || 'Credenciales incorrectas');
        }
        
        setIsLoading(false);
        return;
      }

      // ÉXITO
      toast.success(`¡Bienvenido de nuevo, ${data.user.name}!`);
      login(data.user, data.token); 
      navigate('/dashboard'); 

    } catch (error) {
      console.error("🔥 Login Error:", error);
      toast.error('Error de conexión con el servidor de EvoluFit.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {isLoading && <FullPageLoader />} 
      
      <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
        <div className={styles.formHeader}>
          <h2>Iniciar Sesión</h2>
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={errors.email ? styles.inputError : ''}
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
            className={errors.password ? styles.inputError : ''}
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