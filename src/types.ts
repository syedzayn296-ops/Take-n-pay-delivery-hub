export type GroceryCategory =
  | 'all'
  | 'hampers'
  | 'butchery'
  | 'produce'
  | 'bakery'
  | 'pantry'
  | 'dairy'
  | 'beverages'
  | 'household';

export interface GroceryProduct {
  id: string;
  name: string;
  brand: string;
  size: string;
  category: GroceryCategory;
  price: number;
  originalPrice?: number;
  isOnSpecial?: boolean;
  isHalal?: boolean;
  badge?: string;
  inStock: boolean;
  imageEmoji: string;
  description: string;
  origin?: string;
}

export interface CartItem {
  product: GroceryProduct;
  quantity: number;
  substitutionPreference?: 'best_match' | 'call_me' | 'refund';
}

export interface HamperDeal {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  savings: number;
  badge: string;
  imageEmoji: string;
  itemsList: string[];
  popular?: boolean;
}

export interface DeliveryAddress {
  id: string;
  label: string; // 'Home', 'Work', 'Family'
  recipientName: string;
  recipientPhone: string;
  streetAddress: string;
  suburb: string;
  city: string; // 'Durban'
  postalCode: string;
  gateCode?: string;
  deliveryNotes?: string;
}

export interface SuburbCoverage {
  suburb: string;
  zone: 'South Durban' | 'North Durban' | 'Central Durban' | 'Highway';
  hubBranch: string;
  etaMinutes: number;
  deliveryFee: number;
  activeDrivers: number;
}

export type OrderStatus = 'placed' | 'picking' | 'dispatched' | 'arriving' | 'delivered';

export interface DriverInfo {
  name: string;
  phone: string;
  rating: number;
  deliveriesCompleted: number;
  vehicle: string;
  licensePlate: string;
  currentProgressPercent: number; // 0 to 100 for live delivery route tracking
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  placedAt: string;
  etaTime: string;
  remainingMinutes: number;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  driverTip: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  substitutionRule: 'best_match' | 'call_me' | 'refund';
  paymentMethod: 'Credit / Debit Card' | 'Ozow Instant EFT' | 'Cash on Delivery';
  hubBranch: string;
  pickerName: string;
  driver: DriverInfo;
  otpCode: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  suburb: string;
  tradingHours: string;
  contactNumber: string;
  hasButchery: boolean;
  hasBakery: boolean;
  hasSixtyHub: boolean;
  hasClickAndCollect: boolean;
}
