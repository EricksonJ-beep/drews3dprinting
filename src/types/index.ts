export type Category = 'Toys/Fidgets' | 'Office Supplies' | 'Hobbies' | 'Birthday Ideas' | 'Holidays';

export interface Product {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: Category | string;
  tags: string[];
  imageUrl: string;
  stock: number;
  isFeatured: boolean;
  createdAt?: string | number;
  updatedAt?: string | number;
}

export interface OrderItem {
  productId: string; // slug
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface Order {
  userId: string;
  orderDate: string; // ISO
  status: 'Pending' | 'Printing' | 'Shipped' | 'Completed';
  totalAmount: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  paymentId: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  shippingDefaults?: ShippingAddress;
  createdAt?: string;
}
