import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './Profile.module.scss';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

export const Profile = () => {
  const { user, logout, token } = useAuthStore();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [showPassForm, setShowPassForm] = useState(false);
  const [passData, setPassData] = useState({ 
    oldPass: '', 
    newPass: '', 
    confirmPass: '' 
  });

  const handleChangePassword = async (e) => {
  e.preventDefault();
  setErrors({});

  const newErrors = {};
  if (!passData.oldPass) newErrors.oldPassword = "La contraseña actual es obligatoria";
  if (!passData.newPass) newErrors.password = "La nueva contraseña es obligatoria";
  if (!passData.confirmPass) newErrors.password = "La confirmación de la contraseña es obligatoria";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return toast.error('Por favor, completa todos los campos');
  }

  // 1. Validaciones previas en el Cliente (UX inmediata)
  if (passData.newPass !== passData.confirmPass) {
    return toast.error("La nueva contraseña y su confirmación no coinciden.");
  }

  

  if (passData.oldPass && passData.newPass === passData.oldPass) {
    return toast.error("La nueva contraseña no puede ser igual a la actual.");
  }

  try {
    // 2. Petición al endpoint "ID-less"
    const res = await fetch(`${BASE_URL}/users/change-password`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        oldPassword: passData.oldPass,
        password: passData.newPass 
      })
    });

    const data = await res.json();

    // 3. Manejo de Errores del Servidor (Validación y Lógica)
    if (!res.ok) {
      // Caso A: Errores de validación de Zod (Middleware)
      if (data.errors && Array.isArray(data.errors)) {
  const apiErrors = {};
  data.errors.forEach(err => { 
    // Si el path es "body.password", extrae "password"
    // Si el path es solo "body", asumimos que es el campo principal (password)
    let cleanPath = err.path.includes('.') ? err.path.split('.').pop() : err.path;
    
    if (cleanPath === 'body') cleanPath = 'password'; 
    
    apiErrors[cleanPath] = err.message;
  });
  
  setErrors(apiErrors);
  return; 
}
      
      // Caso B: Errores de lógica del controlador (ej. 401, 404)
      // Usamos el mensaje que viene del back o uno genérico
      throw new Error(data.message || 'Error al actualizar la contraseña');
    }

    // 4. ÉXITO
    setShowPassForm(false);
    setPassData({ oldPass: '', newPass: '', confirmPass: '' });
    toast.success("¡Seguridad actualizada! Contraseña cambiada.");

  } catch (error) {
    // 5. Manejo de Errores de Red o Lanzados manualmente (throw)
    console.error("Change Password Error:", error);
    toast.error(error.message || "Error de conexión con el servidor.");
  }
};

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '¿Estás completamente seguro?',
      text: "Se borrarán todos tus RMs y progreso. Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d', 
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar mi rastro',
      background: '#111',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        // 3. Eliminación usando la ruta /delete-me
        const res = await fetch(`${BASE_URL}/users/delete-me`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          toast.info("Cuenta eliminada. Esperamos verte pronto.");
          logout(); 
          navigate('/'); 
        }
      } catch (error) {
        toast.error("No se pudo procesar la solicitud de eliminación.");
      }
    }
  };

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <h2>Mi <span>Perfil</span></h2>
        <p>Configuración de cuenta y seguridad de EvolutFit.</p>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>📋 Datos Personales</h3>
          </div>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <label>Atleta</label>
              <p>{user?.name} {user?.lastname}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Edad</label>
              <p>{user?.age} años</p>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>🔐 Seguridad</h3>
          </div>
          
          <div className={styles.actions}>
            {!showPassForm ? (
              <button className={styles.changePasswordBtn} onClick={() => setShowPassForm(true)}>
                Cambiar Contraseña
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className={styles.passForm}>
                <div className={styles.inputGroup}>
                  <label>Contraseña Actual</label>
                  <input 
                    type="password" 
                    placeholder="Tu clave actual..."
                    value={passData.oldPass}
                    onChange={(e) => setPassData({...passData, oldPass: e.target.value})}
                     
                  />    
                  {errors.oldPassword && <span className={styles.errorText}>{errors.oldPassword}</span>}              
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Nueva Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="Mínimo 8 caracteres..."
                    value={passData.newPass}
                    onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                     
                  />
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Confirmar Nueva Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="Repite la nueva clave..."
                    value={passData.confirmPass}
                    onChange={(e) => setPassData({...passData, confirmPass: e.target.value})}
                     
                  />
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>

                <div className={styles.formBtns}>
                  <button type="submit" className={styles.saveBtn}>Guardar Cambios</button>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowPassForm(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className={styles.dangerZone}>
              <h4>Zona Crítica</h4>
              <p>Una vez eliminada la cuenta, no hay marcha atrás.</p>
              <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
                Borrar Cuenta
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};