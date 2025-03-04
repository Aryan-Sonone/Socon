"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        try {
          console.log("Logging in with:", { username, password });

          const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          const userData = await response.json();
          console.log("API Response:", userData);
          // ✅ Store token in localStorage (for client-side use)
          localStorage.setItem("auth-storage", JSON.stringify({ token: userData.token, isAuthenticated: true }));

          // ✅ Store authentication in cookies (for middleware)
          document.cookie = `auth-storage=${encodeURIComponent(JSON.stringify({ isAuthenticated: true }))}; path=/; max-age=86400; Secure`;

          if (!response.ok) {
            throw new Error(userData.message || "Invalid credentials");
          }

          set({ user: userData, isAuthenticated: true });
          console.log("User logged in:", userData);
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },

      logout: () => {
        document.cookie = "auth-storage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        set({ user: null, isAuthenticated: false });
        window.location.href = "/login"; // Force reload to apply changes
      },     
    }),
    {
      name: "auth-storage",
    },
  ),
)

