import { useQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getShopProducts,
  // 
} from "../services/api/productService";

// export const useShopProducts = () =>
//   useQuery({
//     queryKey: ["products", "shop"],
//     queryFn: getShopProducts,
//   });

// export const useShopProductsWithDetails = () =>
//   useQuery({
//     queryKey: ["products", "shop", "details"],
//     queryFn: 
//   });
export const useShopProducts = (collectionId?: number) =>
  useQuery({
    queryKey: ["products", "shop", collectionId ?? "all"],
    queryFn: () => getShopProducts(collectionId),
  });

export const useShopProductsWithDetails = (collectionId?: number) =>
  useQuery({
    queryKey: ["products", "shop", "details", collectionId ?? "all"],
    queryFn: async () => {
      const list = await getShopProducts(collectionId);
      const details = await Promise.all(list.map((p) => getProductBySlug(p.slug)));
      return details;
    },
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: getFeaturedProducts,
  });

export const useAllProducts = () =>
  useQuery({
    queryKey: ["products", "all"],
    queryFn: getAllProducts,
  });

export const useProductBySlug = (slug: string) =>
  useQuery({
    queryKey: ["product", "slug", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });

export const useProductById = (id: number) =>
  useQuery({
    queryKey: ["product", "id", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });