
export interface Review {
  id: number;
  productId?: number;
  userFullName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewDto {
  productId: number;
  rating: number;
  comment: string;
}