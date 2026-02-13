'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api, updateOrderStatus as apiUpdateStatus } from '../api';
import { socket } from '../socket';

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
    address: o.address
  }));
};

export function useAdminOrders() {
  const queryClient = useQueryClient();

  // Fetch orders with TanStack Query
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    // Orders change frequently, shorter stale time
    staleTime: 30 * 1000, // 30 seconds
  });

  // Mutation for updating order status with optimistic updates
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: AdminOrder['status'] }) => {
      await apiUpdateStatus(orderId, status);
      return { orderId, status };
    },
    // Optimistic update - UI updates immediately
    onMutate: async ({ orderId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      // Snapshot previous value
      const previousOrders = queryClient.getQueryData<AdminOrder[]>(['orders']);

      // Optimistically update
      queryClient.setQueryData<AdminOrder[]>(['orders'], (old = []) =>
        old.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      return { previousOrders };
    },
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
      console.error('Failed to update status:', err);
    },
    // Refetch after success to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Socket.io integration - invalidate queries on real-time events
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

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter((o) => o.status === 'accepted' || o.status === 'completed');

  return {
    orders,
    updateOrderStatus,
    addOrder: () => { console.warn('addOrder is deprecated'); },
    pendingOrders,
    activeOrders,
    isLoaded: !isLoading,
  };
}
