import { Request, Response } from 'express';
import Order from '../models/Order';
import { getIO } from '../utils/socket';
import { PushSubscription } from '../models/PushSubscription';
import { sendPushNotification } from '../utils/webPush';

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'Your order has been accepted!';
    case 'processing':
      return 'Your order is being prepared...';
    case 'completed':
    case 'delivered':
      return 'Your order has been delivered!';
    case 'declined':
    case 'cancelled':
      return 'Your order has been cancelled';
    default:
      return `Order status: ${status}`;
  }
};

const sendPushToUser = async (userEmail: string, orderId: string, status: string) => {
  try {
    console.log('Sending push notification to:', userEmail, 'for order:', orderId, 'status:', status);
    
    const subscriptions = await PushSubscription.find({ userEmail });
    console.log('Found subscriptions:', subscriptions.length);
    
    if (subscriptions.length === 0) {
      console.log('No subscriptions found for user');
      return;
    }
    
    for (const sub of subscriptions) {
      const payload = {
        title: 'AuraCafe Order Update',
        body: getStatusMessage(status),
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: `order-${orderId}`,
        data: {
          url: `/history?orderId=${orderId}`,
          orderId,
          status,
        },
      };

      console.log('Sending push notification to endpoint:', sub.subscription.endpoint);
      const result = await sendPushNotification(sub.subscription, payload);
      
      if (result?.error === 'expired') {
        console.log('Subscription expired, removing...');
        await PushSubscription.deleteOne({ _id: sub._id });
      } else if (result?.error === 'failed') {
        console.log('Push notification failed');
      } else {
        console.log('Push notification sent successfully');
      }
    }
  } catch (error) {
    console.error('Push notification error:', error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { orderType, items, totalAmount, userEmail, customerName, phoneNumber, address } = req.body;

    const order = new Order({
      orderType,
      items,
      totalAmount,
      userEmail,
      customerName,
      phoneNumber,
      address,
    });

    const createdOrder = await order.save();

    // Emit event to Admin
    const io = getIO();
    io.to('admin').emit('newOrder', createdOrder);

    res.status(201).json(createdOrder);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: 'Invalid order data', error: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();

      // Emit event to User via Socket
      const io = getIO();
      if (order.userEmail) {
        io.to(order.userEmail).emit('orderStatusUpdated', updatedOrder);
        
        // Send push notification
        await sendPushToUser(order.userEmail, order._id.toString(), status);
      }
      // Also emit to admin to update their view if needed, or just broadcast
      io.emit('orderStatusUpdated', updatedOrder); 

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/history/:email
// @access  Private
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
