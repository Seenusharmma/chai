import express from 'express';
import { createOrder, getOrders, updateOrderStatus, getUserOrders } from '../controllers/orderController';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:id/status').put(updateOrderStatus);
router.route('/history/:email').get(getUserOrders);

export default router;
