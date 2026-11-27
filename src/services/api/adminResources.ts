import axiosInstance from "../../lib/axiosInstance";
import { createResourceApi } from "./resourceApi";
import type { Product } from "../../types/product.types";
import type {
  AdminBlog,
  AdminCollection,
  AdminFaq,
  AdminOrder,
  AdminReview,
  AdminUser,
  TitleItem,
  TitlePayload,
 ReviewPayload, UserPayload
} from "../../types/admin.types";

export const productsApi       = createResourceApi<Product, FormData>("/products", { pageSize: 200 });
export const categoriesApi     = createResourceApi<TitleItem, TitlePayload>("/categories");
export const collectionsApi    = createResourceApi<AdminCollection, FormData>("/collections");
export const blogsApi          = createResourceApi<AdminBlog, FormData>("/blogs");
export const blogCategoriesApi = createResourceApi<TitleItem, TitlePayload>("/blogcategories");
// export const faqsApi           = createResourceApi<AdminFaq, Omit<AdminFaq, "id" | "faqCategoryTitleEn">>("/faq");
// export const faqCategoriesApi  = createResourceApi<TitleItem, TitlePayload>("/faqcategory");
export const faqsApi          = createResourceApi<AdminFaq, Omit<AdminFaq, "id" | "faqCategoryTitleEn">>("/faqs");
export const faqCategoriesApi = createResourceApi<TitleItem, TitlePayload>("/faqcategories");
// export const reviewsApi        = createResourceApi<AdminReview>("/reviews", { count: 200 });
export const reviewsApi = createResourceApi<AdminReview, ReviewPayload>("/reviews", { count: 200 });
export const ordersApi         = createResourceApi<AdminOrder>("/orders");


export const getBlogById = async (id: number): Promise<AdminBlog> => {
  const res = await axiosInstance.get<AdminBlog>(`/blogs/${id}`);
  return res.data;
};

export const setBlogPublished = (id: number, published: boolean) =>
  axiosInstance.patch(`/blogs/${id}/${published ? "publish" : "unpublish"}`);

export const productImagesApi = {
  remove: (productId: number, imageId: number) =>
    axiosInstance.delete(`/products/${productId}/images/${imageId}`),
  setPrimary: (productId: number, imageId: number) =>
    axiosInstance.patch(`/products/${productId}/images/${imageId}/set-primary`),
  setHover: (productId: number, imageId: number) =>
    axiosInstance.patch(`/products/${productId}/images/${imageId}/set-hover`),
};
export const getUsers = async (): Promise<AdminUser[]> => {
  const res = await axiosInstance.get<AdminUser[]>("/users");
  return res.data;
};

export const setUserStatus = (id: string, isActive: boolean) =>
  axiosInstance.patch(`/users/${id}/status`, null, { params: { isActive } });

export const getOrders = async (): Promise<AdminOrder[]> => {
  const res = await axiosInstance.get<AdminOrder[]>("/orders");
  return res.data;
};

export const setOrderStatus = (id: number, status: string) =>
  axiosInstance.patch(`/orders/${id}/status`, null, { params: { status } });

export const createUser = (payload: UserPayload) => axiosInstance.post("/users", payload);