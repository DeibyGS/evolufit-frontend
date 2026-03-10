import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './RegisterForm.module.scss';
import { toast } from 'sonner';
import { BASE_URL } from '../api/API';
import { FullPageLoader } from '../components/FullPageLoader';

/**
 * COMPONENTE: RegisterForm (EvoluFit Optimized)
 * @description Maneja el registro con feedback visual de errores por campo.
 */
export const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para capturar errores de validación (Zod backend)
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Limpiamos el error del campo al escribir para mejorar UX
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Resetear errores previos

    // Validaciones de UI rápidas
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
      return toast.error("Las contraseñas no coinciden.");
    }

    setIsLoading(true); 

    const registrationPayload = {
      name: formData.name.trim(), 
      lastname: formData.lastname.trim(), 
      age: Number(formData.age), 
      email: formData.email.trim().toLowerCase(), 
      password: formData.password 
    };  

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationPayload)
      });
      
      const data = await response.json();
      
      if(response.ok){
        toast.success("¡Registro exitoso! Ya puedes iniciar sesión.");
        navigate('/auth');
      } else {
        // Mapeo de errores de Zod (viene como array de objetos {path: string[], message: string})
        if (data.errors && Array.isArray(data.errors)) {
          const apiErrors = {};
          data.errors.forEach(err => {
            // El path de Zod suele ser un array, tomamos el primer elemento
            const fieldName = Array.isArray(err.path) ? err.path[0] : err.path;
            if (fieldName) apiErrors[fieldName] = err.message;
          });
          setErrors(apiErrors);
          toast.error('Revisa los campos marcados en rojo');
        } else {
          toast.error(data.message || 'Error en el registro');
        }
        setIsLoading(false);
      }
    } catch(error) {
      toast.error('Error de red: Inténtalo de nuevo más tarde.');
      setIsLoading(false);
    } 
  };

  return (
    <div className={styles.registerContainer}>
      {isLoading && <FullPageLoader />}

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Nombre</label>
            <input 
              type="text" 
              name="name" 
              className={errors.name ? styles.inputError : ''}
              onChange={handleChange} 
              required 
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label>Apellidos</label>
            <input 
              type="text" 
              name="lastname" 
              className={errors.lastname ? styles.inputError : ''}
              onChange={handleChange} 
              required 
            />
            {errors.lastname && <span className={styles.errorText}>{errors.lastname}</span>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Edad</label>
          <input 
            type="number" 
            name="age" 
            className={errors.age ? styles.inputError : ''}
            onChange={handleChange} 
            required 
          />
          {errors.age && <span className={styles.errorText}>{errors.age}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            className={errors.email ? styles.inputError : ''}
            onChange={handleChange} 
            required 
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label>Contraseña</label>
          <input 
            type="password" 
            name="password" 
            className={errors.password ? styles.inputError : ''}
            onChange={handleChange} 
            required 
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label>Repetir Contraseña</label>
          <input 
            type="password" 
            name="confirmPassword" 
            className={errors.confirmPassword ? styles.inputError : ''}
            onChange={handleChange} 
            required 
          />
          {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        </div>

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