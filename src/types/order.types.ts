export interface CreateOrderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  items: {
    productId: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }[];
}