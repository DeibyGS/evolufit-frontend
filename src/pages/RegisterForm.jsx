import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './RegisterForm.module.scss';
import { toast } from 'sonner';

export const RegisterForm = () => {
  const navigate = useNavigate();
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    console.log('Usuario registrado:', formData);

    try{
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
        console.log('Registro exitoso:', data);
        toast.success("Registro exitoso. Por favor, inicia sesión.");
        navigate('/auth');
      }else{
        console.error('Error en el registro:', data);
        toast.error(data.message || 'Error en el registro');
      }
    }catch(error){
      console.error('Error de red:', error);
      
    } 

  };

  return (
    <div className={styles.registerContainer}>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        
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

        <button type="submit" className={styles.submitButton}>
          Registrarse
        </button>

        <div className={styles.footerLinks}>
          <span>¿Ya tienes cuenta?</span>
          <Link to="/auth" className={styles.loginLink}>Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
};