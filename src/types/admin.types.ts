
import type { ReactNode } from "react";

export interface Entity {
  id: number;
}

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => ReactNode;
}

export interface FormProps<T, P> {
  item: T | null;
  submitting: boolean;
  onSubmit: (payload: P) => void;
  onClose: () => void;
}

export interface TitleItem extends Entity {
  titleAz: string;
  titleEn: string;
  slug?: string;
}

export interface TitlePayload {
  titleAz: string;
  titleEn: string;
  slug: string;
}

export interface AdminCollection extends TitleItem {
  image?: string | null;
  productCount?: number;
}

export interface AdminBlog extends Entity {
  titleAz: string;
  titleEn: string;
  slug?: string;
  excerptAz?: string;
  excerptEn?: string;
  contentAz?: string;
  contentEn?: string;
  coverImage?: string | null;
  authorAz?: string;
  authorEn?: string;
  isPublished: boolean;
  publishedAt?: string | null;
  blogCategoryId: number;
  categoryTitleEn?: string;
}

export interface AdminFaq extends Entity {
  questionAz: string;
  questionEn: string;
  answerAz: string;
  answerEn: string;
  displayOrder: number;
  isActive: boolean;
  faqCategoryId: number;
  faqCategoryTitleEn?: string;
}

export interface AdminReview extends Entity {
  userName?: string;
  productTitle?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface AdminOrder extends Entity {
  customerName?: string;
  totalPrice: number;
  status: string;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  isActive: boolean;
  createdAt?: string;
}
export interface AdminOrderItem {
  id: number;
  productId: number;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface AdminOrder extends Entity {
  // customerName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  totalPrice: number;
  status: string;
  // createdAt: string;
  items: AdminOrderItem[];
}

export interface ReviewPayload {
  productId: number;
  rating: number;
  comment: string;
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}