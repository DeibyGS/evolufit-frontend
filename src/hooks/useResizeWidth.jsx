import React, { useEffect, useState } from 'react'

/**
 * HOOK: useResizeWidth
 * Escucha activamente el ancho de la ventana del navegador.
 * Provee la fuente de verdad para los cálculos de breakpoints en JS.
 */
export const useResizeWidth = () => {
    // Inicializamos con el ancho actual del viewport
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        /**
         * Manejador de evento que actualiza el estado.
         * Se ejecuta en cada frame del cambio de tamaño.
         */
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        // Suscripción al evento global de la ventana
        window.addEventListener('resize', handleResize);
        
        /**
         * CLEANUP FUNCTION (Crucial): 
         * Elimina el event listener cuando el componente se desmonta 
         * para prevenir fugas de memoria (memory leaks).
         */
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Array vacío: solo se suscribe al montar y se limpia al desmontar

  // Retornamos el valor numérico para ser consumido por useMediasQuerys
  return width;
}