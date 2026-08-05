# 🏋️‍♂️ EvolutFit - Frontend Client

**EvolutFit** is a high-performance platform for comprehensive workout and health management. Built with the cutting-edge **React 19** and **Vite** stack, the app delivers a _Single Page Application (SPA)_ focused on data visualization, community gamification, and a premium user interface based on **Glassmorphism**.

---

## ⚡ Core Highlights

- **Data Visualization:** Interactive dashboards that render weight and BMI progress in real time with `Recharts`.
- **Protected Layout Architecture:** Private route system managed through a centralized `DashboardLayout` and security guard components.
- **Pro Gamification:** Achievement system based on accumulated load volume and a dynamic "Hall of Fame" (Leaderboard) to foster competitiveness.
- **Senior Styling System:** Modular **SASS (SCSS)** architecture with a robust mixin engine for scalable components and total visual coherence.
- **Reporting & Export:** Ability to generate dynamic PDF documents of routines and metrics using `jsPDF` and `html2canvas`.
- **Adaptive UX:** Custom hooks for responsiveness and performance animations that guarantee 60fps.

---

## 🛠️ Tech Stack

### Core & Build

- **React 19:** Latest version for efficient DOM management and transition support.
- **Vite:** High-performance build tool with ultra-fast Hot Module Replacement (HMR).
- **React Router Dom v7:** Complex navigation management, sub-routes, and nested layouts.

### State & Data

- **Zustand:** Atomic, lightweight, reactive global state management (Auth, User Info).
- **Recharts:** Data visualization with dynamic performance charts.

### Styles & UI

- **SASS (SCSS) Modules:** Style encapsulation to avoid collisions and ease maintenance.
- **Mixin System:** Custom library for Flexbox, responsive grids, Glassmorphism, and gradient buttons.
- **Sonner & SweetAlert2:** Professional visual feedback and interactive modals.

---

## 📂 Directory Architecture

```text
src/
├── assets/          # Images, icons, and static resources
├── components/      # Global UI and Landing components
│   ├── Header/Footer/Hero # Landing Page structure
│   ├── ContactSection/Service/ReviewSection # Informative sections
│   ├── ProtectedRoute/ForgotPassword # Access and Security logic
│   └── ToastConfig # Global notification configuration
├── data/            # Static content and business configuration
│   ├── achievements.json # Definition of medals and achievements
│   ├── dataprices.json   # Plans and pricing configuration
│   ├── exercises.js      # Supported exercises database
│   └── reviewsdata.json  # Testimonials and reviews data
├── hooks/           # Extracted React logic for reuse
│   ├── useCounterPerformance # Animated counter logic
│   ├── useMediaQuerys        # Design breakpoint management
│   └── useResizeWidth        # Dynamic window dimension control
├── layout/          # Main structure containers
│   └── LayoutPrincipal/ # The heart of the App (Authenticated Dashboard)
│       ├── Achievements/    # Medals and achievements system
│       ├── Calculator/      # Health metrics calculator
│       ├── Dashboard/       # Charts and progress visualization
│       ├── Leaderboard/     # Strength ranking (Hall of Fame)
│       ├── Profile/         # Profile and security management
│       ├── RMCalculator/    # Repeat Max calculator
│       ├── Routines/        # Workout management and logging
│       └── SocialRoutines/  # Community feed and interaction
├── pages/           # Access and error views (404, AuthPage, Home, etc.)
├── store/           # Zustand configuration
│   └── authStore        # Global authentication and user state
└── styles/          # SASS styling architecture
    ├── variables.scss    # Design tokens (colors, typography)
    ├── mixing.scss       # Reusable mixins (flexbox, responsive)
    ├── reset.scss        # Base style normalization
    └── global.scss       # Shared styles and utilities
```

## ⚙️ Installation & Setup

### Clone the repository

```bash
git clone https://github.com/DeibyGS/evolufit-frontend.git
cd evolufit-frontend
```

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

## 🚀 Available Scripts

| Command | Description |
| ------- | ----------- |
| npm run dev     | Starts the development server with HMR. |
| npm run build   | Compiles and optimizes the project for production into `/dist`. |
| npm run lint    | Runs ESLint to ensure code quality. |
| npm run preview | Previews the production build locally. |

## 🧪 Test User (Demo)

To explore all the application features without creating a new account, you can use these demo credentials:

- **Email:** `user@user.com`
- **Password:** `11111111`

> **Note:** This user has preloaded workout history so you can immediately see the progress charts and statistics on the Dashboard.

## 🔌 API Integration (Detailed Endpoints)

Communication between the Frontend and Backend is done through a RESTful architecture. All endpoints (except Auth) require the `Authorization: Bearer <token>` header.

### 🔐 Authentication Module (`/auth`)
*Access and identity creation management.*

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new athletes with Zod validation. |
| `POST` | `/auth/login` | Authentication and JWT delivery. |

### 👤 Users & Profile Module (`/users`)
*Account management and community visibility.*

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/users` | Get all users (for Rankings). |
| `GET` | `/users/:id` | View a specific athlete's public profile. |
| `PUT` | `/users/profile` | Update general data (Name, age, etc.). |
| `PATCH` | `/users/change-password` | Secure password change (validates current pass). |
| `DELETE` | `/users/delete-me` | Permanently delete the athlete's account. |

### 🏋️ Workouts Module (`/workouts`)
*Physical activity logging and performance analytics.*

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/workouts` | Log a new workout session. |
| `GET` | `/workouts/my-workouts` | Full user session history. |
| `GET` | `/workouts/stats` | Analytics data (Muscle distribution/Volume). |
| `GET` | `/workouts/total-volume` | Total load sum for the achievements system. |
| `GET` | `/workouts/:id` | Detailed breakdown of a session's exercises. |
| `DELETE` | `/workouts/:id` | Delete a record from history. |

### 🏆 Records & Ranking Module (`/rm`)
*Maximum strength control and global competitiveness.*

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/rm` | Register 1 Repetition Maximum (1RM). |
| `GET` | `/rm` | User's personal record history. |
| `GET` | `/rm/leaderboard` | Global Hall of Fame (Best records ranking). |
| `DELETE` | `/rm/:id` | Delete a personal record. |

### 📊 Health & Biometrics Module (`/health`)
*Body metrics and calorie expenditure tracking.*

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/health` | Register BMI, BMR (Mifflin-St Jeor) and TDEE. |
| `GET` | `/health` | Complete biometric history for the athlete. |
| `DELETE` | `/health/:id` | Delete a health record. |

### 🤝 Social & Community Module (`/social`)
*Interaction and knowledge sharing.*

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/social` | Community feed with filters (muscle/search). |
| `POST` | `/social` | Publish routines to the community. |
| `PUT` | `/social/:id` | Edit own posts. |
| `PATCH` | `/social/:id/like` | "Like" interaction system (Toggle). |
| `DELETE` | `/social/:id` | Delete own posts. |

## 🚀 Backend Deployment

The **EvolutFit** backend is deployed on **Render**.

- **API Base URL:** `https://evolufit-backend.onrender.com/api`
- **Backend Repository:** [github.com/DeibyGS/evolufit-backend](https://github.com/DeibyGS/evolufit-backend)

> **⚠️ Performance note (Cold Start):**
> Since it's hosted on Render's free plan, the server suspends after 15 minutes of inactivity.
>
> For this reason, the **first request** may take between **50 and 60 seconds** to respond while the service wakes up. Subsequent requests will run at normal speed.

## 🤝 Contributing & Architecture Guidelines

As the **EvolutFit** architect, I've established the following technical pillars to ensure the code is maintainable, scalable, and high-performance. Any contribution is expected to respect these rules:

### 🎨 Design System & Styles (SASS)

- **Zero Hardcoding Policy:** Using arbitrary hexadecimal values, `px` or `rem` units directly in `.module.scss` files is strictly prohibited.
- **Design Tokens:** Only use the variables from `src/styles/variables.scss` for colors, typography, spacing, and radii.
- **Layout Logic:** For repetitive structures (centering, calculator grids, glassmorphism effects), always use the `@mixins` defined in `src/styles/mixins.scss`.

### 🏗️ Structure & Modularity

- **Layout Architecture:** The views that make up the authenticated user experience (Dashboard, Profile, History) must be implemented within `src/layouts/DashboardLayout/`. This ensures the Sidebar persists and protects route integrity.
- **Atomic Components:** Reusable UI elements (buttons, inputs, cards) must be agnostic to business logic and live in `src/components/`.

### 🔐 State & Data Management

- **Single Source of Truth:** Session, user profile, and JWT token management is centralized in the Zustand `authStore`.
- **Prop-Drilling:** Passing user information through multiple component levels is prohibited if that information is already available in the global store.
- **Model Integrity:** When expanding the exercise database (`src/data/exercises.js`), it's imperative to respect the `id` and `group` structure to avoid inconsistencies in the Leaderboard filtering system.

### 🧪 Code Quality

- Before committing, make sure to run `npm run lint` to comply with the style standards defined by **ESLint**.