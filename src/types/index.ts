export interface Service {
    id: string;
    name: string;
    duration: string;
    price: string;
    priceFrom?: boolean;
  }
  
  export interface Barber {
    id: string;
    name: string;
    role: string;
    image?: string;
  }
  
  export interface Review {
    id: string;
    author: string;
    date: string;
    rating?: number;
    content: string;
  }
  
  export interface BusinessHour {
    day: string;
    hours: string;
  }
  
  export interface ShopLocation {
    id: string;
    name: string;
    address: string;
    rating?: string;
    reviewCount?: number;
    type: string;
  }