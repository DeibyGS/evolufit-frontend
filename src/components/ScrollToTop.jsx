// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forzamos al navegador a ir al punto (0,0) cada vez que cambie la ruta
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; 
};