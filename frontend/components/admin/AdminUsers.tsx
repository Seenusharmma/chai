'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, ShieldAlert, Check, X, Loader2, Mail, UserPlus, Trash2 } from 'lucide-react';
import { useUserRole } from '@/lib/request/UserContext';
import { Badge } from '@/components/ui/Badge';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'super-admin';
    createdAt: string;
}

export function AdminUsers() {
    const { isSuperAdmin } = useUserRole();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [promoting, setPromoting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${API_URL}/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
        if (!isSuperAdmin) return;
        setUpdating(userId);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole });

            // Update local state
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error('Error updating user role:', error);
        } finally {
            setUpdating(null);
        }
    };

    const promoteByEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setPromoting(true);
        setMessage(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await axios.post(`${API_URL}/users/promote-by-email`, { email: email.trim() });

            setMessage({ type: 'success', text: `Successfully promoted ${email} to admin!` });
            setEmail('');

            // Refresh user list
            await fetchUsers();
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to promote user'
            });
        } finally {
            setPromoting(false);
        }
    };

    const deleteUser = async (userId: string, userEmail: string) => {
        if (!isSuperAdmin) return;
        if (!confirm(`Are you sure you want to delete ${userEmail}?`)) return;

        setUpdating(userId);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            await axios.delete(`${API_URL}/users/${userId}`);

            // Remove from local state
            setUsers(users.filter(user => user._id !== userId));
            setMessage({ type: 'success', text: `Successfully deleted ${userEmail}` });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to delete user'
            });
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-[#D4A574] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Promote by Email Form */}
            {isSuperAdmin && (
                <div className="bg-[#2D2520] p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-[#D4A574]" />
                        Promote User to Admin
                    </h3>
                    <form onSubmit={promoteByEmail} className="space-y-3">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89B8F]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter user email address"
                                    className="w-full pl-10 pr-4 py-2 bg-[#1A1410] border border-white/10 rounded-lg text-white text-sm placeholder:text-[#A89B8F] focus:outline-none focus:border-[#D4A574]"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={promoting || !email.trim()}
                                className="px-4 py-2 bg-[#D4A574] text-[#1A1410] font-semibold rounded-lg hover:bg-[#C49564] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {promoting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Promoting...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-4 h-4" />
                                        Make Admin
                                    </>
                                )}
                            </button>
                        </div>
                        {message && (
                            <div className={`text-xs p-2 rounded ${message.type === 'success'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-red-500/10 text-red-400'
                                }`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </div>
            )}
            {/* Mobile View */}
            <div className="md:hidden space-y-3">
                {users.map((user) => (
                    <div key={user._id} className="bg-[#2D2520] p-4 rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-medium">{user.name || 'Unknown'}</h3>
                                <p className="text-xs text-[#A89B8F]">{user.email}</p>
                            </div>
                            <Badge className={
                                user.role === 'super-admin' ? 'bg-purple-500/20 text-purple-400' :
                                    user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-gray-500/20 text-gray-400'
                            }>
                                {user.role}
                            </Badge>
                        </div>

                        {isSuperAdmin && user.role !== 'super-admin' && (
                            <div className="flex gap-2 pt-2 border-t border-white/5">
                                {user.role === 'user' ? (
                                    <button
                                        onClick={() => updateUserRole(user._id, 'admin')}
                                        disabled={updating === user._id}
                                        className="flex-1 py-2 bg-[#D4A574] text-[#1A1410] text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                                    >
                                        {updating === user._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                                        Make Admin
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => updateUserRole(user._id, 'user')}
                                        disabled={updating === user._id}
                                        className="flex-1 py-2 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                                    >
                                        {updating === user._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldAlert className="w-3 h-3" />}
                                        Revoke Admin
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteUser(user._id, user.email)}
                                    disabled={updating === user._id}
                                    className="py-2 px-3 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                                >
                                    {updating === user._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block bg-[#2D2520] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#1A1410] text-[#A89B8F]">
                        <tr>
                            <th className="px-4 py-3 font-medium">User</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3">
                                    <div>
                                        <div className="text-white font-medium">{user.name || 'Unknown'}</div>
                                        <div className="text-xs text-[#A89B8F]">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge className={
                                        user.role === 'super-admin' ? 'bg-purple-500/20 text-purple-400' :
                                            user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                    }>
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {isSuperAdmin && user.role !== 'super-admin' && (
                                        <div className="flex items-center justify-end gap-2">
                                            {user.role === 'user' ? (
                                                <button
                                                    onClick={() => updateUserRole(user._id, 'admin')}
                                                    disabled={updating === user._id}
                                                    className="px-3 py-1.5 bg-[#D4A574]/10 text-[#D4A574] hover:bg-[#D4A574]/20 rounded-lg text-xs font-medium transition-colors"
                                                >
                                                    {updating === user._id ? 'Updating...' : 'Make Admin'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateUserRole(user._id, 'user')}
                                                    disabled={updating === user._id}
                                                    className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors"
                                                >
                                                    {updating === user._id ? 'Updating...' : 'Revoke Admin'}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteUser(user._id, user.email)}
                                                disabled={updating === user._id}
                                                className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
