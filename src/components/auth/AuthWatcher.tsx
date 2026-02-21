// src/components/auth/AuthWatcher.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthToken, clearAuthToken } from "@/api/client";

export function AuthWatcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getAuthToken();
    const expiredFlag = localStorage.getItem("nsv_auth_expired");

    const isLoginRoute = location.pathname === "/login";
    const isRegisterRoute = location.pathname === "/register";
    const isPublicRoute = isLoginRoute || isRegisterRoute;

    // se estou na tela de login, limpamos a flag para não ficar em loop
    if (isLoginRoute && expiredFlag) {
      localStorage.removeItem("nsv_auth_expired");
    }

    if (!isPublicRoute && (!token || expiredFlag)) {
      localStorage.removeItem("nsv_auth_expired");
      clearAuthToken();
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}