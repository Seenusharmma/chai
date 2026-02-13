import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '../api';
import { socket } from '../socket';
import { CartItem } from '../types';

export interface HistoryOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export function useHistory() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [orderHistory, setOrderHistory] = useState<HistoryOrder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Initial Fetch
  useEffect(() => {
    const fetchHistory = async () => {
      // Mark as loaded even if user is not logged in
      if (!isUserLoaded) return;
      
      if (!userEmail) {
        setIsLoaded(true);
        return;
      }
      
      try {
        const response = await api.get(`/orders/history/${encodeURIComponent(userEmail)}`);
        const mappedOrders = response.data.map((o: any) => ({
          id: o._id,
          items: o.items.map((i: any) => ({
             id: i.itemId,
             name: i.name,
             price: i.price,
             quantity: i.quantity
          })),
          total: o.totalAmount,
          subtotal: o.totalAmount / 1.1,
          tax: o.totalAmount - (o.totalAmount / 1.1),
          createdAt: o.createdAt,
          status: o.status
        }));
        setOrderHistory(mappedOrders);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchHistory();
  }, [userEmail, isUserLoaded]);

  // Socket Integration
  useEffect(() => {
    if (!userEmail || !isUserLoaded) return;
    if (!socket.connected) {
        socket.connect();
    }
    
    socket.emit('joinUser', userEmail);

    const handleStatusUpdate = (updatedOrder: any) => {
      setOrderHistory((prev) =>
        prev.map((order) =>
          order.id === updatedOrder._id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
    };

    socket.on('orderStatusUpdated', (updatedOrder) => {
        console.log('Received orderStatusUpdated:', updatedOrder); // Debug log
        handleStatusUpdate(updatedOrder);
    });

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, [userEmail, isUserLoaded]);

  const addOrder = () => { console.warn('addOrder is refactored to use API directly in checkout'); };
  
  const clearHistory = () => {
      setOrderHistory([]);
  };

  const totalSpent = orderHistory.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orderHistory.length;

  return {
    orderHistory,
    addOrder,
    clearHistory,
    totalSpent,
    totalOrders,
    isLoaded,
    isLoggedIn: !!userEmail,
  };
}
