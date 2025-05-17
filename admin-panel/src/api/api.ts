import { Order, Salon, Service, Staff } from "../types";

const API_URL = 'http://localhost:4000/api';

// Salon API calls
export const fetchSalons = async (): Promise<Salon[]> => {
  const response = await fetch(`${API_URL}/salons/`);
  if (!response.ok) {
    throw new Error('Failed to fetch salons');
  }
  return response.json();
};

export const createSalon = async (formData: FormData): Promise<Salon> => {
  const response = await fetch(`${API_URL}/salons`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create salon');
  }
  return response.json();
};

// Service API calls
export const fetchServices = async (salonId: string): Promise<Service[]> => {
  const response = await fetch(`${API_URL}/services/${salonId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }
  return response.json();
};

export const createService = async (salonId: string, formData: FormData): Promise<Service> => {
  const response = await fetch(`${API_URL}/services/${salonId}`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create service');
  }
  return response.json();
};

// Staff API calls
export const fetchStaff = async (salonId: string): Promise<Staff[]> => {
  const response = await fetch(`${API_URL}/staffs/${salonId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch staff');
  }
  return response.json();
};

export const createStaff = async (salonId: string, formData: FormData): Promise<Staff> => {
  const response = await fetch(`${API_URL}/staffs/${salonId}`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create staff');
  }
  return response.json();
};

// Order API calls
export const fetchOrders = async (salonId: string): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/orders/${salonId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

export const createOrder = async (salonId: string, order: Omit<Order, '_id'>): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders/${salonId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return response.json();
};