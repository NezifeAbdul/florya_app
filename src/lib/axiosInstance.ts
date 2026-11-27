import axios from "axios";
import { notifyAuthChange } from "../utils/authStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
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
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      notifyAuthChange();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;