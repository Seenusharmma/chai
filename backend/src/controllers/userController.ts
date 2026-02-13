import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Sync user from Clerk
// @route   POST /api/users/sync
// @access  Public
export const syncUser = async (req: Request, res: Response) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // Hardcode super admin
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'roshansharma404error@gmail.com';
      const role = email === superAdminEmail ? 'super-admin' : 'user';

      user = await User.create({
        clerkId,
        email,
        name,
        role,
      });
    } else {
      // Ensure super admin role is accurate if email matches
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'roshansharma404error@gmail.com';
      if (email === superAdminEmail && user.role !== 'super-admin') {
        user.role = 'super-admin';
        await user.save();
      }
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Super Admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Super Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent modifying super admin
    if (user.role === 'super-admin') {
      res.status(403).json({ message: 'Cannot modify Super Admin role' });
      return;
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Promote user to admin by email
// @route   POST /api/users/promote-by-email
// @access  Private (Super Admin only)
export const promoteUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create a placeholder user with admin role
      user = await User.create({
        clerkId: `placeholder_${Date.now()}`, // Temporary clerkId
        email,
        name: email.split('@')[0], // Use email prefix as name
        role: 'admin',
      });
    } else {
      // Update existing user to admin
      if (user.role === 'super-admin') {
        res.status(403).json({ message: 'Cannot modify Super Admin role' });
        return;
      }
      user.role = 'admin';
      await user.save();
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Super Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent deleting super admin
    if (user.role === 'super-admin') {
      res.status(403).json({ message: 'Cannot delete Super Admin' });
      return;
    }

    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


