# Evolufit 🏋️‍♂️🔥

**Evolufit** es una plataforma integral de gestión de entrenamiento y salud diseñada para atletas que buscan llevar su progreso al siguiente nivel. Permite trackear entrenamientos, calcular métricas de salud, competir en ránkings de fuerza y compartir experiencias con una comunidad activa.

---

## 🚀 Características Principales

### 📊 Dashboard Evolutivo

Visualización avanzada mediante gráficas interactivas con **Recharts** que muestran el progreso de carga, repeticiones y volumen por cada grupo muscular en rangos de fechas personalizables.

### 📝 Gestión de Rutinas e Historial

- **Registro detallado:** Guarda series, repeticiones y peso por ejercicio de forma intuitiva.
- **Historial Dinámico:** Visualización de los últimos 10 entrenamientos con scroll infinito para explorar todo tu progreso pasado.

### 🏆 Hall of Fame & RM (Repetición Máxima)

- **Cálculo de RM:** Herramienta integrada para medir tu fuerza máxima teórica.
- **Leaderboard en tiempo real:** Los récords superados aparecen automáticamente en el salón de la fama.
- **Sistema de Desafío:** El sistema identifica si posees el récord actual ("¡Eres el líder!") o te muestra la marca exacta "A batir" si el récord lo tiene otro atleta.

### 🥇 Sistema de Logros

Gamificación integrada donde se desbloquean medallas (Bronce, Plata, Oro, Épico) basadas en hitos de volumen total levantado, incentivando la constancia.

### 🤝 Comunidad Social

- **Feed Interactivo:** Comparte tus rutinas y mejores sesiones con el resto de la comunidad.
- **Feedback y Motivación:** Sistema de "Me gusta" para interactuar con otros usuarios.
- **Filtros Avanzados:** Búsqueda de rutinas por grupo muscular, antigüedad o popularidad (más votados).

### 🧮 Calculadora Fitness Pro

- Seguimiento de **IMC, TMB (Tasa Metabólica Basal) y Gasto Calórico Diario**.
- Historial de mediciones personales clasificado con etiquetas de **Top Oro, Plata y Bronce** para motivar la mejora de la composición corporal.

### 👤 Perfil y Seguridad

- Control de datos personales (nombre, edad, mail).
- Opciones de seguridad para modificar contraseña o eliminación definitiva de la cuenta.

---

## 🛠️ Stack Tecnológico

### Frontend (evolutfit)

- **React 19** & **Vite**: Interfaz de usuario moderna y de alto rendimiento.
- **Zustand**: Gestión de estado global ligera y eficiente.
- **Sass**: Estilos modulares con arquitectura de mixins y variables.
- **Recharts**: Gráficas dinámicas de rendimiento.
- **Sonner & SweetAlert2**: Sistema de notificaciones y diálogos de confirmación.
- **jsPDF & html2canvas**: Exportación de reportes de entrenamiento a formato PDF.
- **React CountUp & Slick Carousel**: Micro-interacciones y sliders para una experiencia fluida.

### Backend (API REST)

- **Node.js** & **Express 5**: Servidor robusto y escalable.
- **MongoDB** & **Mongoose**: Base de datos NoSQL con modelos relacionales para salud, social y entrenamientos.
- **JWT (JSON Web Tokens)**: Autenticación segura basada en tokens.
- **Bcrypt**: Encriptación de alta seguridad para contraseñas.
- **CORS & Dotenv**: Configuración de seguridad y gestión de variables de entorno.

---

## 📂 Estructura del Backend (Modelos)

El core de la aplicación se sustenta en los siguientes modelos de datos:

- `User`: Credenciales, perfil y metadatos.
- `Workout`: Sesiones de entrenamiento, ejercicios y series.
- `RM`: Historial de marcas personales y récords del Hall of Fame.
- `Health`: Registros biométricos e historial de cálculos fitness.
- `Social`: Publicaciones de la comunidad, gestión de likes e interacciones.

---

## 📦 Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone [https://github.com/tu-usuario/evolufit.git](https://github.com/tu-usuario/evolufit.git)
```
