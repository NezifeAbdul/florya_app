import axiosInstance from "../../lib/axiosInstance";
import type { CreateOrderPayload } from "../../types/order.types";

export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await axiosInstance.post<{ id: number; totalPrice: number }>("/orders", payload);
  return res.data;
};