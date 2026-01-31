import { React } from "react";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
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
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));

    set({
      isAuthenticated: true,
      token: token,
      user: userInfo,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  },
}));
