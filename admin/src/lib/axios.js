import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
});

let getTokenFunction = null;
export const initializeAxiosAuth = (getToken) => {
    getTokenFunction = getToken;
};

axiosInstance.interceptors.request.use(
    async (config) => {
        if (!getTokenFunction) {
            console.warn("Axios no está inicializado con Clerk auth");
            return config;
        }

        try {
            const skipCache = config.headers['X-Retry-Request'] === 'true';

            const token = await getTokenFunction({
                template: "mobile-app-token",
                skipCache,
            });

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;

                if (import.meta.env.DEV) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
                        const status = skipCache ? "recargado" : "cargado desde caché";
                        console.log(`Token ${status} - expira en ${Math.floor(expiresIn / 60)}min`);
                    } catch (e) {
                        console.log("Token obtenido");
                    }
                }
            }

            if (config.data && !(config.data instanceof FormData)) {

                if (!config.headers['Content-Type']) {
                    config.headers['Content-Type'] = 'application/json';
                }
            }

        } catch (error) {
            console.error("Error obteniendo token:", error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("Error 401 - recargando token...");
            originalRequest._retry = true;

            try {

                originalRequest.headers['X-Retry-Request'] = 'true';

                return await axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Error en retry:", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
