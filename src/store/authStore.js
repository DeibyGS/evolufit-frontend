import { React } from "react";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  // Inicializamos mirando si existe un token en el navegador
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,

  login: (userData, token) => {
    const userInfo = {
      id: userData.id || userData._id,
      name: userData.name,
      email: userData.email,
      age: userData.age,
      lastname: userData.lastname,
    };
    // Guardamos en localStorage para persistencia
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));

    set({
      isAuthenticated: true,
      token: token,
      user: userInfo,
    });
  },

  logout: () => {
    // Limpiamos todo al salir
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  },
}));
