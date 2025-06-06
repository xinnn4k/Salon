export interface Salon {
  email: string;
  _id: string;
  name: string;
  location: string;
  phone: string;
  image?: string;
}

export interface Service {
  _id: string;
  salonId: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export interface Staff {
  email: string;
  _id: string;
  salonId: string;
  name: string;
  specialty: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  price: any;
  staff?: Staff;
  _id: string;
  salonId: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'cancelled';
  service?: Service;
  staffId: string;
}
