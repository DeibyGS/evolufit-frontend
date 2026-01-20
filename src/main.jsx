import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { App } from "./App.jsx";
import "./index.scss";

import { Home } from "./pages/Home.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { NotFound } from "./pages/404.jsx";
import { RegisterForm } from "./pages/RegisterForm.jsx";
import { ForgotPassword } from "./components/ForgotPassword.jsx";


import { DashboardLayout } from "./layouts/DashboardLayout/DashboardLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Calculator } from "./layouts/Calculator/Calculator.jsx";
import { Profile } from "./layouts/Profile/Profile.jsx";

import { ToastConfig } from "./components/ToastConfig.jsx";
import { Routines } from "./layouts/Routines/Routines.jsx";
import { RMCalculator } from "./layouts/RMCalculator/RMCalculator.jsx";
import { Leaderboard } from "./layouts/Leaderboard/Leaderboard.jsx";
import { Achievements } from "./layouts/Achievements/Achievements.jsx";
import { Dashboard } from "./layouts/Dashboard/Dashboard.jsx";
import { SocialRoutines } from "./layouts/SocialRoutines/SocialRoutines.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastConfig/>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
           </Route>

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>}>
          <Route index element={<Dashboard/>} /> {/* Aquí irá tu resumen de estadísticas */}
          <Route path="profile" element={<Profile/>} />
          <Route path="routines" element={<Routines/>} />
          <Route path="calculator" element={<Calculator/>} />
          <Route path="rm-calculator" element={<RMCalculator/>} />
          <Route path="leaderboard" element={<Leaderboard/>} />
          <Route path="achievements" element={<Achievements/>} />
          <Route path="social" element={<SocialRoutines/>} />
          
        </Route>

          <Route path="*" element={<NotFound />} />
       
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
