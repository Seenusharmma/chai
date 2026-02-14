export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  rating: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  sizes?: Size[];
  isVeg?: boolean;
}

export interface Size {
  name: 'small' | 'medium' | 'large';
  price: number;
}

export type Category = 
  | 'biriyani' 
  | 'chicken' 
  | 'mutton' 
  | 'egg' 
  | 'veg' 
  | 'rice' 
  | 'roti'
  | 'roll'
  | 'soup'
  | 'noodles'
  | 'bread'
  | 'sandwich'
  | 'burger'
  | 'momo'
  | 'salad'
  | 'tea'
  | 'coffee'
  | 'mocktails'
  | 'maggie';

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerDetails: CustomerDetails;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  createdAt: Date;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
}
