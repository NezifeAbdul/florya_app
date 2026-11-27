export interface Product {
  id: number;
  titleAz: string;
  titleEn: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  primaryImage: string;
  hoverImage: string | null;
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  categoryTitleAz: string;
  categoryTitleEn: string;
  averageRating: number;
  reviewCount: number;
}

export interface ProductListResponse {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ProductImage {
  id: number;
  url: string;
  displayOrder: number;
  isPrimary: boolean;
  isHover: boolean;
}

export interface ProductDetail {
  id: number;
  titleAz: string;
  titleEn: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  sizes: string[];
  colors: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: number;
  categoryTitleAz: string;
  categoryTitleEn: string;
  collectionId?: number | null;
  collectionTitleAz?: string;
  collectionTitleEn?: string;
  images: ProductImage[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}