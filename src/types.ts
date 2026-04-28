export type UserRole = 'anonymous' | 'buyer' | 'admin' | 'owner';

export interface Profile {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  phone_verified?: boolean;
  shipping_address?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  parent_category: string;
  specs: Record<string, any>;
  image_url: string;
  gallery_urls?: string[];
  is_new?: boolean;
  is_deal?: boolean;
  is_unlisted?: boolean;
  discount_price?: number;
  promotion_label?: string;
  detailed_specs?: string;
  created_at?: string;
}

export type OrderStatus = 'pending' | 'packing' | 'courier_pickup' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded' | 'refund_requested';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  order_type: 'buy' | 'build';
  payment_method?: 'card' | 'cod' | 'gcash' | 'maya' | 'crypto';
  payment_status?: 'unpaid' | 'paid' | 'refunded';
  tracking_number?: string;
  cancellation_reason?: string;
  fulfilled_by?: string;
  payment_proof_url?: string;
  shipping_address?: string;
  latitude?: number;
  longitude?: number;
  shipping_fee?: number;
  payment_verified_at?: string;
  special_instructions?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PCBuild {
  cpu?: Product;
  motherboard?: Product;
  ram?: Product;
  gpu?: Product;
  storage: (Product | null)[];
  psu?: Product;
  case?: Product;
  cooler: (Product | null)[];
  monitor?: Product;
  os?: Product;
  peripherals: (Product | null)[];
}

export interface Chat {
  id: string;
  user_id: string;
  assigned_admin_id: string | null;
  is_ai_active: boolean;
  status: 'active' | 'closed';
  created_at: string;
  profiles?: { username: string };
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string | null;
  role: 'user' | 'bot' | 'admin';
  text: string;
  created_at: string;
  status?: 'sending' | 'sent' | 'error';
}

export type RefundStatus = 'pending' | 'approved' | 'rejected';

export interface Refund {
  id: string;
  order_id: string;
  user_id: string;
  reason_code: 'wrong_item' | 'damaged' | 'not_as_described' | 'other';
  explanation: string;
  evidence_urls: string[];
  status: RefundStatus;
  admin_notes?: string;
  created_at: string;
  orders?: Order;
  profiles?: Profile;
}

export interface Promotion {
  id: string;
  image_url: string;
  redirect_link?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  postal_code: string;
  street_address: string;
  label: 'Home' | 'Work';
  lat?: number;
  lng?: number;
  is_default: boolean;
  created_at: string;
}

export interface SavedBuild {
  id: string;
  user_id: string;
  build_name: string;
  components_json: PCBuild;
  total_price: number;
  created_at: string;
}
