import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './RegisterForm.module.scss';
import { toast } from 'sonner';
import { BASE_URL } from '../api/API';
import { FullPageLoader } from '../components/FullPageLoader';

/**
 * COMPONENTE: RegisterForm
 * @description
 * Gestiona el alta de nuevos usuarios en la plataforma EvolutFit.
 * Implementa un flujo de validación en cascada (Front-end primero, API después)
 * para optimizar recursos. Utiliza un estado de carga global para manejar
 * el tiempo de respuesta del servidor.
 * * @técnico
 * - Validaciones: Coincidencia de password, longitud mínima y rango de edad.
 * - Integración: Realiza un POST con el payload filtrado (excluyendo confirmación).
 * - UX: Bloqueo de UI mediante FullPageLoader durante el proceso asíncrono.
 */
export const RegisterForm = () => {
  const navigate = useNavigate();

  /** @state {boolean} isLoading - Controla la visibilidad del overlay de carga */
  const [isLoading, setIsLoading] = useState(false);

  /** @state {Object} formData - Almacena los datos del formulario de registro */
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  /**
   * Actualiza el estado local de forma reactiva según el tipo de input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  /**
   * Procesa la validación y el envío de datos al backend.
   * @async
   * @param {React.FormEvent} e - Evento de envío.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validaciones previas al envío para ahorrar ancho de banda/peticiones
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if(formData.password.length < 6){
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if(formData.age < 13 || formData.age > 100){
      toast.error("La edad debe estar entre 14 y 100 años.");
      return;
    }

    setIsLoading(true); 

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          age: formData.age,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if(response.ok){
        toast.success("¡Registro exitoso! Ya puedes iniciar sesión.");
        navigate('/auth');
      } else {
        toast.error(data.message || 'Error en el registro');
        setIsLoading(false);
      }
    } catch(error) {
      toast.error('Error de red: El servidor está procesando tu alta. Por favor, espera.');
      setIsLoading(false);
    } 
  };

  return (
    <div className={styles.registerContainer}>
      {/* Componente de carga para gestionar el cold start del backend en Render */}
      {isLoading && <FullPageLoader />}

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        
        {/* Agrupación de Nombre y Apellidos mediante CSS Grid/Flex definido en SCSS */}
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Nombre</label>
            <input type="text" name="name" onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Apellidos</label>
            <input type="text" name="lastname" onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Edad</label>
          <input type="number" name="age" onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Contraseña</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Repetir Contraseña</label>
          <input type="password" name="confirmPassword" onChange={handleChange} required />
        </div>

        {/* Control de validación de términos legales para cumplimiento de RGPD */}
        <div className={styles.termsGroup}>
          <input 
            type="checkbox" 
            id="terms" 
            name="acceptTerms" 
            onChange={handleChange} 
            required 
          />
          <label htmlFor="terms">Acepto los términos y condiciones</label>
        </div>

        {/* El botón se deshabilita durante la carga para evitar race conditions */}
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Registrarse'}
        </button>

        <div className={styles.footerLinks}>
          <span>¿Ya tienes cuenta?</span>
          <Link to="/auth" className={styles.loginLink}>Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
};