import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from './LoginForm.module.scss';
import { toast } from 'sonner';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore(); 

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`¡Bienvenido de nuevo, ${data.user.name}!`);
        login(data.user, data.token);
        navigate('/dashboard');  
      } else {
        toast.error(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      toast.error('Error de red: No se pudo conectar con el servidor');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
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

        <button type="submit" className={styles.submitButton}>
          Entrar
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