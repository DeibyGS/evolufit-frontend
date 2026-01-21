/**
 * MAIN ENTRY POINT - EVOLUTFIT
 * Configuración del árbol de componentes, enrutamiento y proveedores globales.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Estilos globales y configuración de notificaciones
import { App } from "./App.jsx";
import "./index.scss";
import { ToastConfig } from "./components/ToastConfig.jsx";

// Componentes de Páginas Públicas (Landing, Login, Registro)
import { Home } from "./pages/Home.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { NotFound } from "./pages/404.jsx";
import { RegisterForm } from "./pages/RegisterForm.jsx";
import { ForgotPassword } from "./components/ForgotPassword.jsx";

// Componentes del Ecosistema Dashboard (Privado)
import { DashboardLayout } from "./layouts/DashboardLayout/DashboardLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Dashboard } from "./layouts/Dashboard/Dashboard.jsx";
import { Profile } from "./layouts/Profile/Profile.jsx";
import { Routines } from "./layouts/Routines/Routines.jsx";
import { Calculator } from "./layouts/Calculator/Calculator.jsx";
import { RMCalculator } from "./layouts/RMCalculator/RMCalculator.jsx";
import { Leaderboard } from "./layouts/Leaderboard/Leaderboard.jsx";
import { Achievements } from "./layouts/Achievements/Achievements.jsx";
import { SocialRoutines } from "./layouts/SocialRoutines/SocialRoutines.jsx";

// Componente para scroll al top en navegación
import { ScrollToTop } from "./components/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Configuración global de Toasts (Sonner) fuera del router para persistencia */}
    <ToastConfig/>
    
    <BrowserRouter basename="/">
      <ScrollToTop/>
      <Routes>
        
        {/* 1. RUTAS PÚBLICAS: Ensuciertas dentro del componente App (Header/Footer común) */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 2. RUTAS PROTEGIDAS: Requieren autenticación y usan un Layout con Sidebar */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Sub-rutas del Dashboard (Se renderizan en el <Outlet /> de DashboardLayout) */}
          <Route index element={<Dashboard/>} /> 
          <Route path="profile" element={<Profile/>} />
          <Route path="routines" element={<Routines/>} />
          <Route path="calculator" element={<Calculator/>} />
          <Route path="rm-calculator" element={<RMCalculator/>} />
          <Route path="leaderboard" element={<Leaderboard/>} />
          <Route path="achievements" element={<Achievements/>} />
          <Route path="social" element={<SocialRoutines/>} />
        </Route>

        {/* 3. MANEJO DE ERRORES: Captura cualquier ruta no definida */}
        <Route path="*" element={<NotFound />} />
       
      </Routes>
    </BrowserRouter>
  </StrictMode>
);