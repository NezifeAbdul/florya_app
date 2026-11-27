import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  } else if (config.data !== undefined) {
    config.headers.set("Content-Type", "application/json");
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && tokenStorage.getAccess()) {
      tokenStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
