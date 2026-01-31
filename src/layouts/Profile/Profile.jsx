import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './Profile.module.scss';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

/**
 * COMPONENTE PROFILE - EVOLUTFIT
 * Permite al usuario visualizar sus datos, actualizar su credencial de acceso
 * y realizar la baja lógica/física de su cuenta.
 */
export const Profile = () => {
  const { user, logout, token } = useAuthStore();
  const navigate = useNavigate();

  const [showPassForm, setShowPassForm] = useState(false);
  const [passData, setPassData] = useState({ 
    oldPass: '', 
    newPass: '', 
    confirmPass: '' 
  });

  /**
   * Manejador para el cambio de contraseña.
   * Realiza validaciones previas de coincidencia y longitud.
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passData.newPass !== passData.confirmPass) {
      return toast.error("Las contraseñas no coinciden.");
    }

    // Regla de seguridad: Longitud mínima
    if (passData.newPass.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres.");
    }

    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          oldPassword: passData.oldPass,
          newPassword: passData.newPass 
        })
      });

      if (response.ok) {
        setShowPassForm(false);
        setPassData({ oldPass: '', newPass: '', confirmPass: '' });
        toast.success("¡Contraseña actualizada!");
      } else {
        const data = await response.json();
        toast.error(data.message || "Error al actualizar.");
      }
    } catch (error) {
      toast.error("Error de conexión: " + error.message);
    }
  };

  /**
   * Proceso de eliminación de cuenta con confirmación de doble paso (UX/DX).
   * Utiliza SweetAlert2 sincronizado con el tema oscuro de la app.
   */
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar cuenta?',
      text: "Esta acción es irreversible y perderás todo tu progreso.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d', 
      confirmButtonText: 'Sí, eliminar permanentemente',
      background: '#111',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/users/${user.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          toast.info("Cuenta eliminada correctamente.");
          logout(); 
          navigate('/'); 
        }
      } catch (error) {
        toast.error("Error al conectar con el servidor." + error.message);
      }
    }
  };

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <h2>Mi <span>Perfil</span></h2>
        <p>Gestiona tu información personal y la seguridad de tu cuenta.</p>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>📋 Datos Personales</h3>
          </div>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <label>Nombre Completo</label>
              <p>{user?.name} {user?.lastname}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Correo Electrónico</label>
              <p>{user?.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Edad Registrada</label>
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
                    value={passData.oldPass}
                    onChange={(e) => setPassData({...passData, oldPass: e.target.value})}
                    required 
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Nueva Contraseña</label>
                  <input 
                    type="password" 
                    value={passData.newPass}
                    onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                    required 
                  />
                </div>

                <div className={styles.formBtns}>
                  <button type="submit" className={styles.saveBtn}>Actualizar</button>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowPassForm(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className={styles.dangerZone}>
              <h4>Zona de Peligro</h4>
              <p>Eliminar tu cuenta borrará todos tus récords y rutinas guardadas.</p>
              <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};