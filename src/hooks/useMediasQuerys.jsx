import React from 'react'
import { useResizeWidth } from './useResizeWidth';

/**
 * HOOK: useMediasQuerys
 * Centraliza la lógica de detección de Viewport de la aplicación.
 * Sincronizado con los breakpoints de SASS establecidos en el sistema de diseño.
 * * @returns {Object} { isDesktop, isTablet, isMobile } - Estados booleanos reactivos.
 */
export const useMediasQuerys = () => {
    // Suscripción al ancho de ventana provisto por el hook base
    const width = useResizeWidth();

    // Breakpoint Desktop: Estándar para monitores y laptops (>= 1024px)
    const isDesktop = width >= 1024;

    // Breakpoint Tablet: Rango intermedio para iPads y dispositivos horizontales (768px - 1023px)
    const isTablet = width >= 768 && width < 1024;

    // Breakpoint Mobile: Dispositivos móviles verticales (< 768px)
    const isMobile = width < 768;

  // Retorna un objeto desestructurable para un consumo limpio en componentes
  return { isDesktop, isTablet, isMobile };
}