'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api, updateOrderStatus as apiUpdateStatus } from '../api';
import { socket } from '../socket';
import axios from 'axios';

export interface AdminOrder {
  id: string;
  items: any[];
  total: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  customerName: string;
  diningMode: 'dine-in' | 'parcel';
  createdAt: string;
  phoneNumber?: string;
  address?: string;
  userEmail?: string;
}

// Fetch all orders
const fetchOrders = async (): Promise<AdminOrder[]> => {
  const response = await api.get('/orders');
  return response.data.map((o: any) => ({
    id: o._id,
    items: o.items,
    total: o.totalAmount,
    status: o.status,
    customerName: o.customerName,
    diningMode: o.orderType,
    createdAt: o.createdAt,
    phoneNumber: o.phoneNumber,
    address: o.address,
    userEmail: o.userEmail
  }));
};

export function useAdminOrders() {
  const queryClient = useQueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch orders with TanStack Query
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 30 * 1000,
  });

  // Mutation for updating order status with optimistic updates
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: AdminOrder['status'] }) => {
      await apiUpdateStatus(orderId, status);
      return { orderId, status };
    },
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData<AdminOrder[]>(['orders']);
      queryClient.setQueryData<AdminOrder[]>(['orders'], (old = []) =>
        old.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      return { previousOrders };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
      console.error('Failed to update status:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Mutation for deleting order
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await axios.delete(`${API_URL}/orders/${orderId}`);
      return orderId;
    },
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData<AdminOrder[]>(['orders']);
      queryClient.setQueryData<AdminOrder[]>(['orders'], (old = []) =>
        old.filter((order) => order.id !== orderId)
      );
      return { previousOrders };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
      console.error('Failed to delete order:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Socket.io integration
  useEffect(() => {
    socket.connect();
    socket.emit('joinAdmin');

    const handleNewOrder = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    const handleStatusUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    socket.on('newOrder', handleNewOrder);
    socket.on('orderStatusUpdated', handleStatusUpdate);

    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.off('orderStatusUpdated', handleStatusUpdate);
      socket.disconnect();
    };
  }, [queryClient]);

  const updateOrderStatus = (orderId: string, status: AdminOrder['status']) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  const deleteOrder = (orderId: string) => {
    deleteOrderMutation.mutate(orderId);
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter((o) => o.status === 'accepted' || o.status === 'completed');

  return {
    orders,
    updateOrderStatus,
    deleteOrder,
    addOrder: () => { console.warn('addOrder is deprecated'); },
    pendingOrders,
    activeOrders,
    isLoaded: !isLoading,
  };
}
