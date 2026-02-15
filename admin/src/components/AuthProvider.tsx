import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { initializeAxiosAuth } from "../lib/axios";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken } = useAuth();

  useEffect(() => {
    initializeAxiosAuth(getToken);
  }, [getToken]);

  return <>{children}</>;
};