export interface BlogCategory {
  id: number;
  titleAz: string;
  titleEn: string;
  slug: string;
}

export interface Blog {
  id: number;
  titleAz: string;
  titleEn: string;
  slug: string;
  excerptAz: string;
  excerptEn: string;
  contentAz?: string;
  contentEn?: string;
  coverImage: string | null;
  authorAz: string;
  authorEn: string;
  isPublished: boolean;
  publishedAt: string;
  blogCategoryId: number;
  categoryTitleAz?: string;
  categoryTitleEn?: string;
}