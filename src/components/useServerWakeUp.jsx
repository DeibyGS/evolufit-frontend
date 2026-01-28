import { useEffect } from 'react';

export const useServerWakeUp = (url) => {
  useEffect(() => {
    // Si no hay URL, no hacemos nada
    if (!url) return;

    const wakeUp = async () => {
      try {
        
        await fetch(url, { mode: 'no-cors' }); 
      } catch (e) {}
    };

    wakeUp();

  }, [url]);
};