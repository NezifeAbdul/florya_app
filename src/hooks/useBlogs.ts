import { useQuery } from "@tanstack/react-query";
import { getBlogs, getBlogBySlug, getBlogCategories } from "../services/api/blogService";

export const useBlogs = () =>
  useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

export const useBlogBySlug = (slug: string) =>
  useQuery({
    queryKey: ["blog", "slug", slug],
    queryFn: () => getBlogBySlug(slug),
    enabled: !!slug,
  });

export const useBlogCategories = () =>
  useQuery({
    queryKey: ["blogCategories"],
    queryFn: getBlogCategories,
  });