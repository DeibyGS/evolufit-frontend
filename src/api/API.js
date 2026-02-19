/**
 * CONFIGURACIÓN CENTRAL DE LA API - EVOLUTFIT
 * Detecta automáticamente el entorno (Local vs Producción)
 */

// Detectamos si estamos en modo desarrollo
const isDevelopment = import.meta.env.MODE === "development";

// Definimos la base dependiendo del entorno
const API_BASE = isDevelopment
  ? "http://localhost:8080/api"
  : "https://evolufit-backend.onrender.com/api";

export const BASE_URL = API_BASE;
export const WAKEUP_URL = `${API_BASE}/rm`;

// Log para que veas en consola a dónde estás apuntando al arrancar
console.log(`🌐 API conectada a: ${BASE_URL}`);
