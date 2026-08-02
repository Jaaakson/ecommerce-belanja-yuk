export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface LookupItem {
  id: string;
  name: string;
}

export interface UserSummary {
  idUser: string;
  userName: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserSummary;
}

export interface ProductListItem {
  idProduct: string;
  productName: string;
  categoryName: string;
  price: number;
  discountPercentage: number | null;
  finalPrice: number;
  qty: number;
  thumbnailUrl: string | null;
}

export interface CartItem {
  idBuyerCart: string;
  idProduct: string;
  productName: string;
  thumbnailUrl: string | null;
  price: number;
  discountPercentage: number | null;
  finalPrice: number;
  discountAmount: number;
  qty: number;
  availableStock: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  shippingCost: number;
  total: number;
}

export interface CheckoutResponse {
  idBuyerTransaction: string;
  paymentName: string;
  finalPrice: number;
}