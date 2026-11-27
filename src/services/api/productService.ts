import axiosInstance from "../../lib/axiosInstance";
import type { Product, ProductDetail, ProductListResponse } from "../../types/product.types";

const apiUrl = (import.meta.env.VITE_API_URL as string) || "http://localhost:5100/api";
const BASE_URL = apiUrl.replace(/\/api\/?$/, "");

const fixImageUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  // backend bəzən yolu iki dəfə yazır: /images/products//images/products/x.jpg
  const cleaned = url.replace(/\/images\/(\w+)\/\/images\/\w+\//, "/images/$1/");
  return `${BASE_URL}${cleaned.startsWith("/") ? cleaned : `/${cleaned}`}`;
};

export const normalizeProduct = (p: Product): Product => ({
  ...p,
  primaryImage: p.primaryImage ? fixImageUrl(p.primaryImage) : "",
  hoverImage: p.hoverImage ? fixImageUrl(p.hoverImage) : null,
});

const normalizeProductDetail = (p: ProductDetail): ProductDetail => ({
  ...p,
  images: (p.images ?? []).map((img) => ({ ...img, url: fixImageUrl(img.url) })),
});

const toList = (data: ProductListResponse | Product[]): Product[] =>
  Array.isArray(data) ? data : data?.items ?? [];

export const getShopProducts = async (collectionId?: number): Promise<Product[]> => {
  const res = await axiosInstance.get<ProductListResponse>("/products/shop", {
    params: collectionId ? { collectionId } : undefined,
  });
  return toList(res.data).map(normalizeProduct);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get<Product[]>("/products/featured");
  return toList(res.data).map(normalizeProduct);
};

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get<ProductListResponse>("/products");
  return toList(res.data).map(normalizeProduct);
};

export const getProductBySlug = async (slug: string): Promise<ProductDetail> => {
  const res = await axiosInstance.get<ProductDetail>(`/products/slug/${slug}`);
  return normalizeProductDetail(res.data);
};

export const getProductById = async (id: number): Promise<ProductDetail> => {
  const res = await axiosInstance.get<ProductDetail>(`/products/${id}`);
  return normalizeProductDetail(res.data);
};