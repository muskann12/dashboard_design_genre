export interface OrderItem {
  name: string;
  category: string;
  id: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
}

export interface Customer {
  fullName: string;
  email: string;
  contactNumber: string;
  address: {
    city: string;
    area: string;
    fullAddress: string;
  };
}

export interface Payment {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  createdAt: string; // ISO date string
}

export interface OrderData {
  _id: string;
  accountName: string;
  orderData: {
    createdAt: string;
    customer: Customer;
    items: OrderItem[];
    payment: Payment;
  };
  delivered: boolean;
  selectedMethod: string;
  total_pay_completed: boolean;
}