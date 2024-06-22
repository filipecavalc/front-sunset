import { Product } from '@/types';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getProducts = async (name?: string, minPrice?: number, maxPrice?: number, page: number = 1, pageSize: number = 10, order: 'asc' | 'desc' = 'asc') => {
  const query = new URLSearchParams();
  if (name) query.append('name', name);
  if (minPrice) query.append('minPrice', minPrice.toString());
  if (maxPrice) query.append('maxPrice', maxPrice.toString());
  query.append('page', page.toString());
  query.append('pageSize', pageSize.toString());
  query.append('order', order);
  
  const res = await api.get(`/products?${query.toString()}`);

  res.data.data.forEach((product: any) => {
    product.images = product.images.map((image: string) => `http://localhost:3000/${image}`);
  });
  return res.data;
};

export const getProductById = async (id: number) => {
  const res = await api.get(`/products/${id}`);
  res.data.images = res.data.images.map((image: string) => `http://localhost:3000/${image}`);
  return res.data;
};

export const getRandomProducts = async () => {
  const res = await api.get(`/products/random`);
  res.data.forEach((product: Product) => {
    product.images = product.images.map((image: string) => `http://localhost:3000/${image}`);
  });
  return res.data;
};

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  
  return response.data;
};

export const addProduct = async (token: string, product: any) => {
  const response = await api.post('/products', product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProduct = async (token: string, id: number, product: any) => {
  const response = await api.put(`/products/${id}`, product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProduct = async (token: string, id: number) => {
  const response = await api.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.status;
};
