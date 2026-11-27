import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  createReview, deleteReview, getLatestReviews, getReviewsByProduct,
} from "../services/api/reviewService";
import type { CreateReviewDto } from "../types/review.types";
import { getErrorMessage } from "./admin/getErrorMessage";


const refreshAll = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["reviews"] });
  qc.invalidateQueries({
    predicate: (q) => String(q.queryKey[0]).toLowerCase().includes("product"),
  });
};

export const useLatestReviews = (count = 10) =>
  useQuery({ queryKey: ["reviews", "latest", count], queryFn: () => getLatestReviews(count) });

export const useProductReviews = (productId: number) =>
  useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: () => getReviewsByProduct(productId),
    enabled: !!productId,
  });

export const useCreateReview = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateReviewDto) => createReview(dto),
    onSuccess: () => {
      refreshAll(qc);
      toast.success(t("reviews.added"));
    },
    onError: (e) => toast.error(`${t("reviews.addError")}: ${getErrorMessage(e)}`),
  });
};

export const useDeleteReview = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      refreshAll(qc);
      toast.success(t("reviews.deleted"));
    },
    onError: (e) => toast.error(`${t("reviews.deleteError")}: ${getErrorMessage(e)}`),
  });
};