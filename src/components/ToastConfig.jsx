import { Toaster } from 'sonner';

/**
 * TOAST CONFIGURATION
 * Sincronizado con el sistema de diseño de EvolutFit.
 * Utiliza las variables Poppins y Roboto, junto con el naranja corporativo.
 */
export const ToastConfig = () => {
  return (
    <Toaster 
      richColors 
      position="top-center" 
      duration={2500}
      toastOptions={{
        // ESTILO BASE: Basado en tus variables y mixin 'card-glass'
        style: {
          background: 'rgba(17, 17, 17, 0.98)', // Tu --primary-color-bg
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 165, 0, 0.5)', // Naranja con opacidad
          color: 'var(--primary-color-text)',
          borderRadius: 'var(--radius)', // Tu variable de 1.2rem
          fontFamily: 'var(--secondary-font-family)', // Poppins
          padding: 'var(--max-padding)',
          fontSize: '0.95rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        },
        // ÉXITO: Borde sólido con el color de tu logo
        success: {
          icon: '⚡',
          style: {
            border: '2px solid #FFA500', // Color exacto de tu logo
            background: 'linear-gradient(145deg, rgba(17,17,17,1) 0%, rgba(30,30,30,1) 100%)',
          },
        },
        // ERROR: Borde en rojo para contraste de peligro
        error: {
          icon: '❌',
          style: {
            border: '2px solid #ff4d4d',
            background: 'rgba(26, 10, 10, 1)',
          },
        },
      }}
    />
  );
};