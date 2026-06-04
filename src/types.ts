export interface StorePrices {
  sirena: number;
  jumbo: number;
  nacional: number;
  plazalama: number;
  bravo: number;
  garrido: number;
  ole: number;
  carrefour: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // base reference price in DOP
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  brand: string;
  tags?: string[];
  isFeatured?: boolean;
  storePrices: StorePrices;
  priceHistory?: {
    date: string;
    sirena: number;
    jumbo: number;
    nacional: number;
    plazalama: number;
    bravo: number;
    garrido: number;
    ole: number;
    carrefour: number;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SchoolItem {
  productId: string;
  name: string;
  quantity: number;
  isRequired: boolean;
  notes?: string;
}

export interface SchoolList {
  id: string;
  schoolName: string;
  grade: string;
  academicYear: string;
  items: SchoolItem[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered';
  shippingDetails: {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
}
