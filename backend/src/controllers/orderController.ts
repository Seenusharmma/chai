import { Request, Response } from 'express';
import Order from '../models/Order';
import { getIO } from '../utils/socket';
import { PushSubscription } from '../models/PushSubscription';
import { sendPushNotification } from '../utils/webPush';

const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'roshansharma404error@gmail.com';

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

const getAdminNotificationMessage = (order: any, isNewOrder: boolean = false) => {
  if (isNewOrder) {
    return `New order #${order._id} - ₹${order.totalAmount}`;
  }
  return `Order #${order._id} status: ${order.status}`;
};

const sendPushToUser = async (userEmail: string, orderId: string, status: string, isAdmin: boolean = false) => {
  try {
    console.log(`[Push] Sending to: ${userEmail}, isAdmin: ${isAdmin}`);
    
    const subscriptions = await PushSubscription.find({ userEmail: userEmail.toLowerCase() });
    console.log(`[Push] Found subscriptions for ${userEmail}:`, subscriptions.length);
    
    if (subscriptions.length === 0) {
      console.log(`[Push] ⚠️ No subscriptions found for ${userEmail}. User needs to enable notifications!`);
      return;
    }
    
    for (const sub of subscriptions) {
      const payload = {
        title: isAdmin ? '🔔 New Order Alert!' : 'AuraCafe Order Update',
        body: isAdmin 
          ? getAdminNotificationMessage({ _id: orderId, status, totalAmount: 0 }, status === 'pending')
          : getStatusMessage(status),
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: `order-${orderId}`,
        data: {
          url: isAdmin ? `/admin` : `/history?orderId=${orderId}`,
          orderId,
          status,
          isAdmin,
        },
      };

      console.log(`[Push] Sending to endpoint: ${sub.subscription.endpoint.substring(0, 50)}...`);
      const result = await sendPushNotification(sub.subscription, payload);
      
      if (result?.error === 'expired') {
        console.log('[Push] Subscription expired, removing...');
        await PushSubscription.deleteOne({ _id: sub._id });
      } else if (result?.error === 'failed') {
        console.log('[Push] ❌ Push notification failed');
      } else {
        console.log('[Push] ✅ Push notification sent successfully');
      }
    }
  } catch (error) {
    console.error('[Push] Error:', error);
  }
};

const sendPushToAdmin = async (order: any, isNewOrder: boolean = false) => {
  console.log(`[Push] === Sending to ADMIN ===`);
  console.log(`[Push] Admin email: ${ADMIN_EMAIL}`);
  await sendPushToUser(ADMIN_EMAIL.toLowerCase(), order._id?.toString() || order._id, order.status || 'pending', true);
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

    // Emit event to Admin via Socket
    const io = getIO();
    io.to('admin').emit('newOrder', createdOrder);

    // Send push notification to Admin
    await sendPushToAdmin(createdOrder, true);

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
        
        // Send push notification to customer
        await sendPushToUser(order.userEmail.toLowerCase(), order._id.toString(), status);
      }
      // Also emit to admin to update their view if needed, or just broadcast
      io.emit('orderStatusUpdated', updatedOrder); 

      // Send push notification to Admin about status change
      await sendPushToAdmin(updatedOrder);

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

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send push notification to customer about order cancellation
    if (order.userEmail) {
      await sendPushToUser(order.userEmail.toLowerCase(), order._id.toString(), 'cancelled');
    }

    await order.deleteOne();
    
    console.log(`[Delete] Order ${req.params.id} deleted successfully`);
    res.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
