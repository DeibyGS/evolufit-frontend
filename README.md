# 🏋️‍♂️ EvolutFit - Frontend Client

**EvolutFit** es una plataforma de alto rendimiento para la gestión integral de entrenamiento y salud. Desarrollada con el stack de vanguardia **React 19** y **Vite**, la aplicación ofrece una experiencia tipo _Single Page Application (SPA)_ centrada en la visualización de datos, la gamificación comunitaria y una interfaz de usuario premium basada en **Glassmorphism**.

---

## ⚡ Core Highlights

- **Visualización de Datos:** Dashboards interactivos que renderizan el progreso del peso e IMC en tiempo real mediante `Recharts`.
- **Arquitectura de Layouts Protegidos:** Sistema de rutas privadas gestionadas mediante un `DashboardLayout` centralizado y componentes de guarda de seguridad.
- **Gamificación Pro:** Sistema de logros basado en volumen de carga acumulado y un "Hall of Fame" (Leaderboard) dinámico para fomentar la competitividad.
- **Sistema de Estilos Senior:** Arquitectura **SASS (SCSS)** modular con un motor de mixins robusto para componentes escalables y coherencia visual total.
- **Reporting & Exportación:** Capacidad de generar documentos PDF dinámicos de rutinas y métricas utilizando `jsPDF` y `html2canvas`.
- **UX Adaptativa:** Hooks personalizados para el manejo de responsividad y animaciones de rendimiento que garantizan 60fps.

---

## 🛠️ Stack Tecnológico

### Core & Build

- **React 19:** Última versión para una gestión eficiente del DOM y soporte de transiciones.
- **Vite:** Build tool de alto rendimiento con Hot Module Replacement (HMR) ultra rápido.
- **React Router Dom v7:** Gestión de navegación compleja, sub-rutas y layouts anidados.

### Estado y Datos

- **Zustand:** Gestión de estado global (Auth, User Info) atómica, ligera y reactiva.
- **Recharts:** Visualización de datos mediante gráficas dinámicas de rendimiento.

### Estilos y UI

- **SASS (SCSS) Modules:** Encapsulamiento de estilos para evitar colisiones y facilitar el mantenimiento.
- **Sistema de Mixins:** Librería propia para Flexbox, Grids responsivos, Glassmorphism y botones degradados.
- **Sonner & SweetAlert2:** Feedback visual profesional y modales interactivos.

---

## 📂 Arquitectura de Directorios

```text
src/
├── assets/          # Imágenes, iconos y recursos estáticos
├── components/      # Componentes UI Globales y Landing
│   ├── Header/Footer/Hero # Estructura de la Landing Page
│   ├── ContactSection/Service/ReviewSection # Secciones informativas
│   ├── ProtectedRoute/ForgotPassword # Lógica de Acceso y Seguridad
│   └── ToastConfig # Configuración global de notificaciones
├── data/            # Contenido estático y configuración de negocio
│   ├── achievements.json # Definición de medallas y logros
│   ├── dataprices.json   # Configuración de planes y precios
│   ├── exercises.js      # Base de datos de ejercicios soportados
│   └── reviewsdata.json  # Datos de testimonios y reviews
├── hooks/           # Lógica de React extraída para reutilización
│   ├── useCounterPerformance # Lógica de contadores animados
│   ├── useMediaQuerys        # Gestión de breakpoints de diseño
│   └── useResizeWidth        # Control dinámico de dimensiones de ventana
├── layout/          # Contenedores de estructura principal
│   └── LayoutPrincipal/ # El corazón de la App (Dashboard Autenticado)
│       ├── Achievements/    # Sistema de medallas y logros
│       ├── Calculator/      # Calculadora de métricas de salud
│       ├── Dashboard/       # Visualización de gráficas y progreso
│       ├── Leaderboard/     # Ranking de fuerza (Hall of Fame)
│       ├── Profile/         # Gestión de perfil y seguridad
│       ├── RMCalculator/    # Calculadora de Repetición Máxima
│       ├── Routines/        # Gestión y registro de entrenamientos
│       └── SocialRoutines/  # Feed de comunidad e interacción
├── pages/           # Vistas de acceso y error (404, AuthPage, Home, etc.)
├── store/           # Configuración de Zustand
│   └── authStore        # Estado global de autenticación y usuario
└── styles/          # Arquitectura de estilos SASS
    ├── variables.scss    # Tokens de diseño (colores, tipografías)
    ├── mixing.scss       # Mixins reutilizables (flexbox, responsive)
    ├── reset.scss        # Normalización de estilos base
    └── global.scss       # Estilos compartidos y utilidades
```

## ⚙️ Instalación y Configuración

### Clonar el repositorio

```bash
git clone https://github.com/DeibyGS/evolufit-frontend.git
cd evolufit-frontend
```

## ⚙️ Instalar Dependencias

```bash
npm install
```

## ⚙️ Lanzar en Desarrollo

```bash
npm run dev
```

## 🚀 Scripts Disponibles

| Comando         | Descripción                                                |
| --------------- | ---------------------------------------------------------- |
| npm run dev     | Inicia el servidor de desarrollo con HMR.                  |
| npm run build   | Compila y optimiza el proyecto para producción en `/dist`. |
| npm run lint    | Ejecuta ESLint para asegurar la calidad del código.        |
| npm run preview | Previsualiza localmente la versión de producción.          |

## 🤝 Lineamientos de Desarrollo (Senior Guidelines)

Como arquitecto de este proyecto, se deben seguir estas pautas estrictas para mantener la calidad y escalabilidad del código:

- **Abstracción de Estilos:** Prohibido el uso de valores "hardcoded". Emplea siempre los tokens de `src/styles/variables.scss` y los mixins de `src/styles/mixins.scss` para cualquier valor de espaciado, color, radio o transición.
- **Modularidad de Layout:** Las funcionalidades del núcleo autenticado (Dashboard) deben residir obligatoriamente en `src/layouts/`. Esto garantiza que compartan el contexto del Sidebar y el Navbar sin duplicar código.
- **Estado Global:** El acceso a la información del usuario, tokens de sesión o estados de carga globales debe realizarse siempre a través del `authStore` de **Zustand**. Se prohíbe el _prop-drilling_ innecesario para datos que ya residen en el store.
- **Consistencia de Datos:** Al añadir nuevos ejercicios o rutinas, asegúrate de que el `id` y el `group` muscular coincidan exactamente con la lógica definida en `src/data/exercises.js`. Esto es crítico para no romper los filtros de búsqueda y las analíticas del **Leaderboard**.

---

## 🧪 Usuario de Prueba (Demo)

Para explorar todas las funcionalidades de la aplicación sin necesidad de crear una cuenta nueva, puedes utilizar las siguientes credenciales de acceso:

- **Email:** `user@user.com`
- **Contraseña:** `111111`

> **Nota:** Este usuario cuenta con un historial de entrenamientos precargado para que puedas visualizar las gráficas de progreso y estadísticas en el Dashboard de forma inmediata.

## 🔌 Integración con la API (Endpoints detallados)

La comunicación entre el Frontend y el Backend se realiza mediante una arquitectura RESTful. Todos los endpoints (excepto Auth) requieren el header `Authorization: Bearer <token>`.

### 🔐 Módulo de Autenticación (`/auth`)
*Gestión de acceso y creación de identidad.*

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Registro de nuevos atletas con validación de Zod. |
| `POST` | `/auth/login` | Autenticación y entrega de Token JWT. |

### 👤 Módulo de Usuarios & Perfil (`/users`)
*Gestión de la cuenta y visibilidad de la comunidad.*

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/users` | Obtención de todos los usuarios (para Rankings). |
| `GET` | `/users/:id` | Ver perfil público de un atleta específico. |
| `PUT` | `/users/profile` | Actualización de datos generales (Nombre, edad, etc.). |
| `PATCH`| `/users/change-password` | Cambio seguro de contraseña (valida pass actual). |
| `DELETE`| `/users/delete-me` | Eliminación definitiva de la cuenta del atleta. |

### 🏋️ Módulo de Entrenamientos (`/workouts`)
*Registro de actividad física y analíticas de rendimiento.*

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/workouts` | Registro de una nueva sesión de entrenamiento. |
| `GET` | `/workouts/my-workouts` | Historial completo de sesiones del usuario. |
| `GET` | `/workouts/stats` | Datos analíticos (Distribución muscular/Volumen). |
| `GET` | `/workouts/total-volume` | Sumatoria de carga total para sistema de logros. |
| `GET` | `/workouts/:id` | Desglose detallado de ejercicios de una sesión. |
| `DELETE`| `/workouts/:id` | Eliminación de un registro del historial. |

### 🏆 Módulo de Marcas & Ranking (`/rm`)
*Control de fuerza máxima y competitividad global.*

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/rm` | Registro de 1 Repetición Máxima (1RM). |
| `GET` | `/rm` | Historial de récords personales del usuario. |
| `GET` | `/rm/leaderboard` | Hall of Fame global (Ranking de mejores marcas). |
| `DELETE`| `/rm/:id` | Eliminación de una marca personal. |

### 📊 Módulo de Salud & Biometría (`/health`)
*Seguimiento de métricas corporales y gasto calórico.*

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/health` | Registro de IMC, TMB (Mifflin-St Jeor) y TDEE. |
| `GET` | `/health` | Historial biométrico completo del atleta. |
| `DELETE`| `/health/:id` | Eliminación de un registro de salud. |

### 🤝 Módulo Social & Comunidad (`/social`)
*Interacción y compartición de conocimientos.*

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/social` | Feed comunitario con filtros (músculo/búsqueda). |
| `POST` | `/social` | Publicación de rutinas en la comunidad. |
| `PUT` | `/social/:id` | Edición de posts propios. |
| `PATCH`| `/social/:id/like` | Sistema de interacción "Like" (Toggle). |
| `DELETE`| `/social/:id` | Eliminación de publicaciones propias. |

## 🚀 Despliegue del Backend

El backend de **EvolutFit** se encuentra desplegado en la plataforma **Render**.

- **Base URL de la API:** `https://evolufit-backend.onrender.com/api`
- **Repositorio Backend:** [github.com/DeibyGS/evolufit-backend](https://github.com/DeibyGS/evolufit-backend)

> **⚠️ Nota sobre el rendimiento (Cold Start):**
> Al estar alojado en el plan gratuito de Render, el servidor entra en estado de suspensión tras 15 minutos de inactividad.
>
> Por este motivo, la **primera petición** que realices puede tardar entre **50 y 60 segundos** en responder mientras el servicio se reactiva. Las peticiones siguientes funcionarán a velocidad normal.

## 🤝 Directrices de Contribución & Arquitectura

Como arquitecto de **EvolutFit**, he establecido los siguientes pilares técnicos para garantizar que el código sea mantenible, escalable y de alto rendimiento. Se espera que cualquier contribución respete estas normas:

### 🎨 Design System & Estilos (SASS)

- **Zero Hardcoding Policy:** Está estrictamente prohibido el uso de valores hexadecimales, unidades `px` o `rem` arbitrarias directamente en los archivos `.module.scss`.
- **Tokens de Diseño:** Se deben utilizar exclusivamente las variables de `src/styles/variables.scss` para colores, tipografías, espaciados y radios.
- **Lógica de Layout:** Para estructuras repetitivas (centrado, grids de calculadoras, efectos glassmorphism), utiliza siempre los `@mixins` definidos en `src/styles/mixins.scss`.

### 🏗️ Estructura y Modularidad

- **Arquitectura de Layouts:** Las vistas que componen la experiencia del usuario autenticado (Dashboard, Perfil, Historial) deben implementarse dentro de `src/layouts/DashboardLayout/`. Esto asegura la persistencia del Sidebar y la integridad de las rutas protegidas.
- **Componentes Atómicos:** Los elementos de UI reutilizables (botones, inputs, cards) deben ser agnósticos a la lógica de negocio y residir en `src/components/`.

### 🔐 Gestión de Estado & Datos

- **Single Source of Truth:** La gestión de la sesión, el perfil del usuario y los tokens JWT se centraliza en el `authStore` de **Zustand**.
- **Prop-Drilling:** Se prohíbe pasar información del usuario a través de múltiples niveles de componentes si dicha información ya está disponible en el store global.
- **Integridad del Modelo:** Al expandir la base de datos de ejercicios (`src/data/exercises.js`), es imperativo respetar la estructura de `id` y `group` para evitar inconsistencias en el sistema de filtrado del Leaderboard.

### 🧪 Calidad de Código

- Antes de realizar un commit, asegúrate de ejecutar `npm run lint` para cumplir con los estándares de estilo definidos por **ESLint**.
