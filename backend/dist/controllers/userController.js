"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.promoteUserByEmail = exports.updateUserRole = exports.getUsers = exports.syncUser = void 0;
const User_1 = __importDefault(require("../models/User"));
// @desc    Sync user from Clerk
// @route   POST /api/users/sync
// @access  Public
const syncUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clerkId, email, name } = req.body;
        if (!clerkId || !email) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        let user = yield User_1.default.findOne({ clerkId });
        if (!user) {
            // Hardcode super admin
            const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'roshansharma404error@gmail.com';
            const role = email === superAdminEmail ? 'super-admin' : 'user';
            user = yield User_1.default.create({
                clerkId,
                email,
                name,
                role,
            });
        }
        else {
            // Ensure super admin role is accurate if email matches
            const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'roshansharma404error@gmail.com';
            if (email === superAdminEmail && user.role !== 'super-admin') {
                user.role = 'super-admin';
                yield user.save();
            }
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.syncUser = syncUser;
// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Super Admin)
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({});
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getUsers = getUsers;
// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Super Admin only)
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }
        const user = yield User_1.default.findById(id);
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
        yield user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.updateUserRole = updateUserRole;
// @desc    Promote user to admin by email
// @route   POST /api/users/promote-by-email
// @access  Private (Super Admin only)
const promoteUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            // Create a placeholder user with admin role
            user = yield User_1.default.create({
                clerkId: `placeholder_${Date.now()}`, // Temporary clerkId
                email,
                name: email.split('@')[0], // Use email prefix as name
                role: 'admin',
            });
        }
        else {
            // Update existing user to admin
            if (user.role === 'super-admin') {
                res.status(403).json({ message: 'Cannot modify Super Admin role' });
                return;
            }
            user.role = 'admin';
            yield user.save();
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.promoteUserByEmail = promoteUserByEmail;
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Super Admin only)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Prevent deleting super admin
        if (user.role === 'super-admin') {
            res.status(403).json({ message: 'Cannot delete Super Admin' });
            return;
        }
        yield User_1.default.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.deleteUser = deleteUser;
