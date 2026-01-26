import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * COMPONENTE: ProtectedRoute (Middleware de Front-end)
 * @description
 * Actúa como un guardián de navegación (Route Guard). Su función es interceptar
 * el acceso a rutas privadas y verificar el estado de autenticación del usuario
 * antes de permitir el renderizado del contenido.
 * * @técnico
 * - Utiliza el patrón 'Wrapper Component' envolviendo las rutas protegidas.
 * - Se integra con 'useAuthStore' (Zustand) para leer el estado de sesión global.
 * - Emplea el componente <Navigate /> para realizar redirecciones programáticas.
 * * @param {React.ReactNode} children - El componente o vista que se desea proteger.
 * @returns {React.ReactNode} El componente solicitado o una redirección al login.
 */
export const ProtectedRoute = ({ children }) => {
  /** * Extraemos el estado de autenticación desde el store global.
   * Se asume que isAuthenticated es un booleano gestionado tras el login exitoso.
   */
  const { isAuthenticated } = useAuthStore();
  
  /**
   * LÓGICA DE CONTROL DE ACCESO:
   * Si el usuario intenta acceder a una ruta protegida sin un token válido o sesión activa,
   * el componente intercepta la petición y lo redirige forzosamente a la vista de autenticación.
   * El atributo 'replace' impide que el usuario regrese a la ruta protegida al pulsar 'atrás'.
   */
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  /**
   * Si la verificación es exitosa, se renderizan los componentes hijos (children).
   */
  return children;
};