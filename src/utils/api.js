import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useApi = () => {
  const { token } = useContext(AuthContext);

  const authFetch = async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,  // 🔥 Se agrega automáticamente
      "Content-Type": "application/json",
    };

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      // Token vencido → opcional, manejar logout automático
      console.error("Token expirado");
    }

    return res.json();
  };

  return { authFetch };
};
