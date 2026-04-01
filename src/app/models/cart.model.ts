export interface Cart {
  id: number;
  items: CartItem[];
  totalAmount: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface AddToCart {
  productId: number;
  quantity: number;
}
