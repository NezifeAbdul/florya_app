import type { ReactNode } from "react";

export interface SubItem {
  key: string;
  to: string;
  icon?: ReactNode;
  label?: string;
}

export interface MenuItem {
  key: string;
  to: string;
  label?: string;
  submenu?: SubItem[];
}

export const NAV_CONFIG: MenuItem[] = [
  { key: "home", to: "/" },
  { key: "product", to: "/product" },
  { key: "collection", to: "/collections" },
  { key: "blog", to: "/blog" },
  { key: "bridal", to: "/product?category=adult" },
  { key: "kids", to: "/product?category=kid" },
  { key: "about", to: "/about" },
  { key: "faq", to: "/faq" },
  { key: "contact", to: "/contact" },
];

export const ADMIN_ITEM: MenuItem = { key: "dashboard", to: "/admin" };