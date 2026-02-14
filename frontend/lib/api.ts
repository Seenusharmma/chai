import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const getUserOrders = async (email: string) => {
  const response = await api.get(`/orders/history/${email}`);
  return response.data;
};

export const getMenu = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const createMenuItem = async (itemData: any) => {
  const response = await api.post('/menu', itemData);
  return response.data;
};

export const updateMenuItem = async (id: string, itemData: any) => {
  const response = await api.put(`/menu/${id}`, itemData);
  return response.data;
};

export const deleteMenuItem = async (id: string) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/menu/categories');
  return response.data;
};
