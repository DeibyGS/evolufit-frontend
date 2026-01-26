import React, { useState, useEffect } from 'react';
import styles from './FullPageLoader.module.scss';

/**
 * COMPONENTE: FullPageLoader
 * @description
 * Componente de interfaz de usuario (UI) que bloquea la interacción mediante un 
 * overlay de pantalla completa. Se utiliza para gestionar los tiempos de espera 
 * asíncronos (Cold Start en Render) y mejorar la retención del usuario mediante 
 * mensajes dinámicos y animaciones de marca.
 * * @técnico
 * - Implementa un bloqueo de scroll en el elemento 'body' mediante efectos secundarios.
 * - Utiliza un temporizador (setInterval) para rotar mensajes motivacionales.
 */

/** Lista de mensajes motivacionales rotativos para mejorar la experiencia de espera */
const messages = [
  "Preparando tus mancuernas...",
  "Calentando el servidor...",
  "Ajustando el cinturón de fuerza...",
  "Cargando tus récords personales...",
  "Evolucionando tu entrenamiento..."
];

export const FullPageLoader = () => {
  /** @state {number} msgIndex - Índice actual del mensaje mostrado */
  const [msgIndex, setMsgIndex] = useState(0);

  /**
   * Efecto para la rotación automática de mensajes cada 4 segundos.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Efecto para el control de scroll del navegador.
   * Evita que el usuario navegue por el fondo mientras la carga está activa.
   */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { 
      document.body.style.overflow = 'unset'; 
    };
  }, []);

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderContent}>
        
        {/* Spinner animado con arquitectura de doble círculo (CSS Keyframes) */}
        <div className={styles.spinner}>
          <div className={styles.innerCircle}></div>
        </div>
        
        {/* Identidad visual con resaltado en el término FIT */}
        <h1 className={styles.logoLoader}>
          EVOLUT<span>FIT</span>
        </h1>
        
        {/* Área de texto dinámico para feedback del sistema */}
        <p className={styles.loadingText}>{messages[msgIndex]}</p>
        
        {/* Indicador informativo sobre el estado del servidor externo */}
        <div className={styles.serverNoticeBadge}>
           Servidor despertando (30s)
        </div>
      </div>
    </div>
  );
};