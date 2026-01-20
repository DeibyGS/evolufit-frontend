import React from 'react'
// Importación del formulario modular para mantener la separación de responsabilidades
import { LoginForm } from './Loginform'

/**
 * COMPONENTE AUTHPAGE - EVOLUTFIT
 * Actúa como el contenedor principal o "Layout" para la vista de inicio de sesión.
 * Su propósito es envolver la lógica del formulario y permitir la adición de
 * elementos decorativos o fondos específicos para la fase de autenticación.
 */
export const AuthPage = () => {
  return (
    /**
     * El div contenedor permite aplicar estilos de posicionamiento (como Flexbox o Grid)
     * para centrar el formulario en la pantalla del usuario.
     */
    <div>
        {/* Renderizado del componente especializado en la captura de credenciales */}
        <LoginForm />
    </div>
  )
}