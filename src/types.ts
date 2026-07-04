/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserPreferences {
  currency: string; // 'INR', 'USD', 'EUR', etc.
  notifications: boolean;
  theme: 'light' | 'dark';
}

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  preferences: UserPreferences;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface PlatformPrice {
  platform: 'amazon' | 'flipkart' | 'ebay' | 'bestbuy' | 'walmart';
  price: number;
  currency: string;
  url: string;
  discount: number; // percentage
  sellerRating: number; // 0-5
  deliveryTime: string; // e.g. "2-3 days", "Tomorrow"
  returnPolicy: string; // e.g. "7 days replacement", "No returns"
  warranty: string; // e.g. "1 year brand warranty"
  shippingCost: number;
  inStock: boolean;
  lastUpdated: string;
}

export interface ProductSpecifications {
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  battery?: string;
  camera?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  specifications: ProductSpecifications;
  prices: PlatformPrice[];
  averageRating: number;
  totalReviews: number;
  images: string[];
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ParsedIntent {
  product: string;
  brand: string;
  budget: number | null;
  specifications: ProductSpecifications;
  features: string[];
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  parsedIntent: ParsedIntent;
  results: {
    productId: string;
    selected: boolean;
    price: number;
    platform: string;
  }[];
  recommendedProduct: Product | null;
  timestamp: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
  notes?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  products: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  platform: string;
  status: 'active' | 'triggered' | 'cancelled';
  notified: boolean;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'search' | 'view' | 'compare' | 'add_to_wishlist' | 'set_alert';
  details: Record<string, any>;
  timestamp: string;
}

export interface AIRecommendation {
  recommendedProduct: Product;
  platform: string;
  price: number;
  reasons: string[];
  alternatives: {
    product: Product;
    platform: string;
    price: number;
    reason: string;
  }[];
  totalScore: number;
}
