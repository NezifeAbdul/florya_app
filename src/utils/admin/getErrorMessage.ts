import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data) return data;
    if (Array.isArray(data)) return data.join(", ");
    if (data?.message) return data.message;
    if (data?.errors) return Object.values(data.errors).flat().join(", ");
    if (error.response?.status === 403) return "You do not have permission for this action";
    if (error.response?.status === 401) return "Session expired, please log in again";
    if (!error.response) return "Cannot reach the server";
  }
  return "Something went wrong";
};