import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from './LoginForm.module.scss';
import { toast } from 'sonner';

// Nota: He quitado la importación de RegisterForm aquí para evitar confusiones de renderizado
export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, } = useAuthStore(); 

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
    console.log('Datos enviados:', formData);
    try{
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      
      if(response.ok){
        console.log('Inicio de sesión exitoso:', data);
        toast.success(`¡Bienvenido de nuevo, ${data.user.name}!`);
        localStorage.setItem('token', data.token);
        login(data.user, data.token);

        navigate('/dashboard');  
      }else{
        console.error('Error en el inicio de sesión:', data);
        toast.error(data.message || 'Error en el inicio de sesión');
      }
    }
    catch(error){
      console.error('Error de red:', error);
      alert('Error de red: ' + error.message);
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
            autoComplete="email"
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
            autoComplete="current-password"
            required
          />
        </div>

        <div className={styles.forgotPassword}>
          {/* Asegúrate de tener esta ruta creada en tu main.jsx o cámbiala por '#' */}
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>

        <button type="submit" className={styles.submitButton}>
          Iniciar Sesión
        </button>

        <div className={styles.footerLinks}>
          <span>¿No tienes cuenta? </span>
          {/* He añadido el texto "Crear cuenta" dentro del Link */}
          <Link to="/register" className={styles.registerLink}>
            Crear cuenta
          </Link>
        </div>
      </form>
    </div>
  );
};