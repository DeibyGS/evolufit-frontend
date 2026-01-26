import './App.scss';
import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { Outlet } from 'react-router-dom';
import { ToastConfig } from './components/ToastConfig.jsx';

/**
 * COMPONENTE: App (Root Layout)
 * @description
 * Actúa como la estructura base o "esqueleto" de la aplicación EvolutFit.
 * Implementa el patrón de diseño 'Layout' para mantener elementos persistentes 
 * (Header y Footer) mientras el contenido central varía según la ruta.
 * * @técnico
 * - Utiliza <Outlet /> de react-router-dom para renderizar las rutas hijas dinámicamente.
 * - Centraliza la configuración de notificaciones globales mediante <ToastConfig />.
 * - Estructura el DOM semánticamente mediante etiquetas <header>, <main> y <footer>.
 */
export const App = () => {

  return (
    <>
      {/* Configuración centralizada de notificaciones (Sonner/Toast) */}
      <ToastConfig />

      {/* Navegación superior persistente en todas las vistas */}
      <Header />

      {/* CONTENEDOR DINÁMICO: 
          La etiqueta <main> envuelve el <Outlet />, que es el espacio donde 
          React Router inyectará los componentes específicos de cada ruta 
          (Login, Register, Dashboard, etc.).
      */}
      <main>
        <Outlet />
      </main>

      {/* Pie de página con enlaces institucionales y redes sociales */}
      <Footer />
    </>
  );
};