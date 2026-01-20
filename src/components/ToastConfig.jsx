import { Toaster } from 'sonner';

export const ToastConfig = () => {
  return (
    <Toaster 
      richColors 
      position="top-center" 
      toastOptions={{
        // Aplicamos estilos base que coincidan con tus botones
        style: {
          background: '#111', // Fondo oscuro como tu sidebar
          border: '1px solid #FFA500', // Borde naranja
          color: '#fff',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--secondary-font-family)',
          padding: '16px',
        },
        // Personalizamos según el tipo de mensaje
        success: {
          style: {
            border: '1px solid #FFA500',
            background: 'linear-gradient(145deg, #111 0%, #222 100%)',
          },
        },
        error: {
          style: {
            border: '1px solid #ff4d4d', // Rojo para errores
            background: '#111',
          },
        },
      }}
    />
  );
};