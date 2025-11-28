/**
 * Represents a single item in the shopping cart
 */
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Represents the shopping cart
 */
export interface Cart {
  items: CartItem[];
}

/**
 * Cart response with computed properties
 */
export interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * Checkout response with order details
 */
export interface CheckoutResponse {
  orderId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  checkoutTime: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
}

/**
 * Input for adding an item to cart
 */
export interface AddItemInput {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Input for updating an item in cart
 */
export interface UpdateItemInput {
  quantity?: number;
  price?: number;
}

