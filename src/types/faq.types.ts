
export interface Faq {
  id: number;
  questionAz: string;
  questionEn: string;
  answerAz: string;
  answerEn: string;
  displayOrder: number;
  isActive: boolean;
  faqCategoryId: number;
  faqCategoryTitleAz?: string;
  faqCategoryTitleEn?: string;
}

export interface FaqCategory {
  id: number;
  titleAz: string;
  titleEn: string;
  displayOrder: number;
  faqCount?: number;
}

export type FaqPayload = Omit<Faq, "id" | "faqCategoryTitleAz" | "faqCategoryTitleEn">;
export type FaqCategoryPayload = Pick<FaqCategory, "titleAz" | "titleEn" | "displayOrder">;