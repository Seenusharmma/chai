import express from 'express';
import { getMenu, seedMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController';
import upload from '../config/upload';

const router = express.Router();

router.get('/', getMenu);
router.post('/seed', seedMenu);
router.post('/', upload.single('image'), createMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
