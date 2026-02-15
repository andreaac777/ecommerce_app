import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect, useRef } from "react";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  if (!__DEV__) {
    return "https://tu-dominio-produccion.com/api";
  }

  if (Platform.OS === "android") {
    console.log("🤖 Usando IP del emulador Android");
    return "http://10.0.2.2:3000/api";
  }

  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (debuggerHost) {
    console.log("📱 Usando IP detectada por Expo:", debuggerHost);
    return `http://${debuggerHost}:3000/api`;
  }
  const MANUAL_IP = "192.168.40.137";
  console.log("💻 Usando IP manual:", MANUAL_IP);
  return `http://${MANUAL_IP}:3000/api`;
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  }
});

export const useApi = () => {
  const { getToken, isSignedIn } = useAuth();
  
  const requestInterceptorRef = useRef<number | null>(null);
  const responseInterceptorRef = useRef<number | null>(null);

  useEffect(() => {
    if (requestInterceptorRef.current !== null) {
      api.interceptors.request.eject(requestInterceptorRef.current);
    }
    if (responseInterceptorRef.current !== null) {
      api.interceptors.response.eject(responseInterceptorRef.current);
    }

    requestInterceptorRef.current = api.interceptors.request.use(
      async (config) => {
        try {
          const skipCache = config.headers['X-Retry-Request'] === 'true';
          console.log("🔑 Obteniendo token para petición...");
          
          const token = await getToken({ 
            template: "mobile-app-token", 
            skipCache
          });

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
              const status = skipCache ? "🔄 refrescado" : "📦 desde caché";
              console.log(`✅ Token ${status} - expira en ${Math.floor(expiresIn/60)} minutos`);
            } catch (e) {
              console.log("✅ Token obtenido");
            }
          } else if (isSignedIn) {
            console.warn("⚠️ Usuario autenticado pero sin token disponible");
          } else {
            console.log("ℹ️ Usuario no autenticado");
          }
        } catch (error) {
          console.error("❌ Error obteniendo token:", error);
        }

        return config;
      },
      (error) => {
        console.error("❌ Error en interceptor de petición:", error);
        return Promise.reject(error);
      }
    );

    responseInterceptorRef.current = api.interceptors.response.use(
      (response) => {
        console.log(`✅ Petición exitosa: ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log("🔄 Detectado error 401, intentando refrescar token...");
          
          originalRequest._retry = true;

          try {
            originalRequest.headers['X-Retry-Request'] = 'true';              
            return await api(originalRequest);
          } catch (refreshError) {
            console.error("❌ Error al refrescar token:", refreshError);
            return Promise.reject(refreshError);
          }
        }

        console.error("❌ Error en petición:", error.message);
        return Promise.reject(error);
      }
    );

    return () => {
      if (requestInterceptorRef.current !== null) {
        api.interceptors.request.eject(requestInterceptorRef.current);
      }
      if (responseInterceptorRef.current !== null) {
        api.interceptors.response.eject(responseInterceptorRef.current);
      }
    };
  }, [getToken, isSignedIn]);

  return api;
};

export default api;