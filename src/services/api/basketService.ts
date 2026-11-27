import axiosInstance from "../../lib/axiosInstance";
import type {
  AddToBasketPayload,
  Basket,
  UpdateBasketItemPayload,
} from "../../types/basket.types";

const BASE_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace("/api", "");

const fixImageUrl = (url: string): string => {
  const cleaned = url.replace(/\/images\/(\w+)\/\/images\/\w+\//, "/images/$1/");
  return `${BASE_URL}${cleaned}`;
};

const normalizeBasket = (basket: Basket): Basket => ({
  ...basket,
  items: basket.items.map((item) => ({
    ...item,
    productImage: item.productImage ? fixImageUrl(item.productImage) : "",
  })),
});

export const fetchBasket = async (): Promise<Basket> => {
  const res = await axiosInstance.get<Basket>("/Basket");
  return normalizeBasket(res.data);
};

export const addToBasket = async (payload: AddToBasketPayload): Promise<Basket> => {
  const res = await axiosInstance.post<Basket>("/Basket/items", payload);
  return normalizeBasket(res.data);
};

export const updateBasketItem = async ({ itemId, quantity }: UpdateBasketItemPayload): Promise<Basket> => {
  const res = await axiosInstance.put<Basket>(`/Basket/items/${itemId}`, { quantity });
  return normalizeBasket(res.data);
};

export const removeBasketItem = async (itemId: number): Promise<Basket> => {
  const res = await axiosInstance.delete<Basket>(`/Basket/items/${itemId}`);
  return normalizeBasket(res.data);
};

export const clearBasket = async (): Promise<void> => {
  await axiosInstance.delete("/Basket");
};