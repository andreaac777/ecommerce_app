import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect, useRef } from "react";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // En producción
  if (!__DEV__) {
    return "https://tu-dominio-produccion.com/api"; // ← Cambia esto cuando despliegues
  }

  // En desarrollo
  // Intentar obtener la IP automáticamente del debugger de Expo
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (debuggerHost) {
    // Si Expo detectó la IP automáticamente (dispositivo físico)
    console.log("📱 Usando IP detectada por Expo:", debuggerHost);
    return `http://${debuggerHost}:3000/api`;
  }

  if (Platform.OS === "android") {
    console.log("🤖 Usando IP del emulador Android");
    return "http://10.0.2.2:3000/api";
  }

  const MANUAL_IP = "192.168.40.137"; 
  console.log("💻 Usando IP manual:", MANUAL_IP);
  return `http://${MANUAL_IP}:3000/api`
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 90000,

  validateStatus: (status) => {
    return status < 500;
  },
});

export const useApi = () => {
  const { getToken } = useAuth();
  const interceptorId = useRef<number | null>(null);

  useEffect(() => {
    
    if (interceptorId.current !== null) {
      api.interceptors.request.eject(interceptorId.current);
    }

    interceptorId.current = api.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return () => {
      if (interceptorId.current !== null) {
        api.interceptors.request.eject(interceptorId.current);
      }
    };
  }, [getToken]);
  
  return api;

};
