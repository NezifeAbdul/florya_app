import { useSyncExternalStore } from "react";
import { getUserId } from "../auth/auth";

export interface WishlistItem {
  id: number;
  slug: string;
  titleEn: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  stock: number;
}

const EMPTY: WishlistItem[] = [];
let cacheKey: string | null = null;
let cache: WishlistItem[] = EMPTY;
const listeners = new Set<() => void>();

const storageKey = (uid: string) => `wishlist_${uid}`;

// İstifadəçi dəyişibsə (login/logout) keşi yenidən yüklə
const sync = () => {
  const uid = getUserId();
  if (uid === cacheKey) return;
  cacheKey = uid;
  if (!uid) {
    cache = EMPTY;
    return;
  }
  try {
    cache = JSON.parse(localStorage.getItem(storageKey(uid)) ?? "[]");
  } catch {
    cache = EMPTY;
  }
};

const getSnapshot = () => {
  sync();
  return cache;
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const persist = (next: WishlistItem[]) => {
  if (!cacheKey) return;
  cache = next;
  localStorage.setItem(storageKey(cacheKey), JSON.stringify(next));
  listeners.forEach((l) => l());
};

export const useWishlist = () => {
  const items = useSyncExternalStore(subscribe, getSnapshot);

  const has = (id: number) => items.some((i) => i.id === id);

  // true = əlavə olundu, false = silindi, null = login yoxdur
  const toggle = (item: WishlistItem): boolean | null => {
    sync();
    if (!cacheKey) return null;
    if (cache.some((i) => i.id === item.id)) {
      persist(cache.filter((i) => i.id !== item.id));
      return false;
    }
    persist([...cache, item]);
    return true;
  };

  const remove = (id: number) => {
    sync();
    persist(cache.filter((i) => i.id !== id));
  };

  return { items, has, toggle, remove };
};