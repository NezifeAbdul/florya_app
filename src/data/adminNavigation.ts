import type { IconType } from "react-icons";
import {
  FiBox,
  FiFileText,
  FiFolder,
  FiGrid,
  FiHelpCircle,
  FiLayers,
  FiList,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiUsers,
} from "react-icons/fi";

export interface NavItem {
  label: string;
  to: string;
  icon: IconType;
  end?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", to: "/admin", icon: FiGrid, end: true }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", to: "/admin/products", icon: FiBox },
      { label: "Categories", to: "/admin/categories", icon: FiTag },
      { label: "Collections", to: "/admin/collections", icon: FiLayers },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blogs", to: "/admin/blogs", icon: FiFileText },
      { label: "Blog categories", to: "/admin/blog-categories", icon: FiFolder },
      { label: "FAQs", to: "/admin/faqs", icon: FiHelpCircle },
      { label: "FAQ categories", to: "/admin/faq-categories", icon: FiList },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", to: "/admin/orders", icon: FiShoppingBag },
      { label: "Reviews", to: "/admin/reviews", icon: FiStar },
      { label: "Users", to: "/admin/users", icon: FiUsers },
    ],
  },
];