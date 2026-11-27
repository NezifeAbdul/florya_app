import axiosInstance from "../../lib/axiosInstance";
import type { Review, CreateReviewDto } from "../../types/review.types";

export const getReviewsByProduct = async (productId: number): Promise<Review[]> => {
  const res = await axiosInstance.get<Review[]>(`/Reviews/product/${productId}`);
  return Array.isArray(res.data) ? res.data : [];
};

export const getLatestReviews = async (count = 10): Promise<Review[]> => {
  const res = await axiosInstance.get<Review[]>("/Reviews", { params: { count } });
  return Array.isArray(res.data) ? res.data : [];
};

export const createReview = async (dto: CreateReviewDto): Promise<Review> => {
  const res = await axiosInstance.post<Review>("/Reviews", dto);
  return res.data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/Reviews/${id}`);
};