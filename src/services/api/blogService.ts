import axiosInstance from "../../lib/axiosInstance";
import type { Blog, BlogCategory } from "../../types/blog.types";

const apiUrl = ((import.meta.env.VITE_API_URL as string | undefined) ?? "") || "http://localhost:5100/api";
const BASE_URL = apiUrl.replace(/\/api\/?$/, "");

const fixImageUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
};

const clean = (s?: string) => (s ?? "").trim();

const normalizeBlog = (b: Blog): Blog => ({
  ...b,
  authorEn: clean(b.authorEn),
  authorAz: clean(b.authorAz),
  excerptEn: clean(b.excerptEn),
  excerptAz: clean(b.excerptAz),
  coverImage: b.coverImage ? fixImageUrl(b.coverImage) : null,
});

// müştəri tərəf: yalnız dərc olunmuş yazılar, token tələb etmir
export const getBlogs = async (): Promise<Blog[]> => {
  const res = await axiosInstance.get<Blog[]>("/Blogs/published");
  const list = Array.isArray(res.data) ? res.data : [];
  return list.map(normalizeBlog);
};

export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const res = await axiosInstance.get<Blog>(`/Blogs/slug/${slug}`);
  return normalizeBlog(res.data);
};

export const getBlogById = async (id: number): Promise<Blog> => {
  const res = await axiosInstance.get<Blog>(`/Blogs/${id}`);
  return normalizeBlog(res.data);
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  const res = await axiosInstance.get<BlogCategory[]>("/BlogCategories");
  return res.data;
};