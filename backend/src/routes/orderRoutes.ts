import express from 'express';
import { createOrder, getOrders, updateOrderStatus, getUserOrders, deleteOrder } from '../controllers/orderController';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:id/status').put(updateOrderStatus);
router.route('/history/:email').get(getUserOrders);
router.route('/:id').delete(deleteOrder);

export default router;
