import express from 'express';
import { syncUser, getUsers, updateUserRole, promoteUserByEmail, deleteUser } from '../controllers/userController';

const router = express.Router();

router.post('/sync', syncUser);
router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.post('/promote-by-email', promoteUserByEmail);
router.delete('/:id', deleteUser);

export default router;
