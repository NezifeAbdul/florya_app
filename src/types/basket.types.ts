export interface BasketItem {
  id: number;
  productId: number;
  productTitleAz: string;
  productTitleEn: string;
  productImage: string;
  slug: string;
  unitPrice: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  availableStock: number;
}

export interface Basket {
  id: number;
  items: BasketItem[];
  totalPrice: number;
  totalItemCount: number;
}

export interface AddToBasketPayload {
  productId: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface UpdateBasketItemPayload {
  itemId: number;
  quantity: number;
}