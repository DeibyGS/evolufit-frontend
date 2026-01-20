# 🏋️‍♂️ EvolutFit - Frontend Client

**EvolutFit** es una plataforma de alto rendimiento para la gestión de entrenamiento y salud, desarrollada con el stack moderno de **React 19** y **Vite**. El proyecto destaca por una arquitectura modular que separa la lógica de negocio, el contenido estático y una arquitectura de estilos robusta, ofreciendo una experiencia de usuario rápida, segura y altamente personalizada.

---

## ⚡ Core Highlights

- **Visualización Pro:** Dashboards interactivos para el seguimiento de carga, repeticiones y volumen mediante Recharts.
- **Arquitectura de Layouts:** Contenedor centralizado para usuarios autenticados que gestiona el corazón de la aplicación.
- **Sistema de Estilos Senior:** Arquitectura SASS modular basada en variables, mixins y utilidades globales.
- **Reporting:** Generación dinámica de documentos PDF para rutinas y métricas de salud con jsPDF.
- **UX Adaptativa:** Hooks personalizados para el manejo de responsividad y animaciones de rendimiento.

---

## 🛠️ Stack Tecnológico

### Core & Build
* **React 19:** Última versión para una gestión eficiente del DOM y Hooks avanzados.
* **Vite:** Herramienta de construcción de próxima generación para un desarrollo ultra rápido.
* **React Router Dom v7:** Manejo de navegación compleja y lógica de enrutamiento.

### Estado y Datos
* **Zustand:** Gestión de estado global (authStore) ligera y desacoplada del UI.
* **Recharts:** Visualización de datos mediante gráficas dinámicas de rendimiento.

### Estilos y UI
* **SASS (SCSS):** Arquitectura de estilos modular y escalable.
* **Slick Carousel:** Sliders responsivos para la navegación de ejercicios y reviews.
* **Sonner & SweetAlert2:** Feedback visual profesional y modales interactivos.

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

| Comando         | Descripción                                                    |
|-----------------|---------------------------------------------------------------|
| npm run dev      | Inicia el servidor de desarrollo con HMR.                     |
| npm run build    | Compila y optimiza el proyecto para producción en `/dist`.    |
| npm run lint     | Ejecuta ESLint para asegurar la calidad del código.           |
| npm run preview  | Previsualiza localmente la versión de producción.             |


## 🤝 Contribución

Como arquitecto de este proyecto, sigo estas pautas estrictas para mantener la calidad y escalabilidad del código:

* **Estilos:** Usa siempre las variables de `styles/variables.scss` para mantener la consistencia visual y los mixins de `styles/mixing.scss` para la estructura de los layouts. No se deben hardcodear valores hexadecimales o espaciados fuera de estos archivos.
* **Layout:** Las funcionalidades del **"Core"** (gestión de entrenamiento, métricas y perfil) deben residir obligatoriamente en `src/layout/LayoutPrincipal/` para mantener la integridad de la experiencia autenticada.
* **Estado:** El acceso a la información del usuario, tokens o estados de sesión debe realizarse siempre a través del `authStore` de **Zustand**. Evita el paso de props innecesarios si la información ya reside en el store global.

---


