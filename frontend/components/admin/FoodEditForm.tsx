'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';

interface FoodEditFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: any;
}

export function FoodEditForm({ isOpen, onClose, onSuccess, item }: FoodEditFormProps) {
    const [formData, setFormData] = useState({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || 'coffee',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            await axios.put(`${API_URL}/menu/${item.id}`, formData);
            onSuccess();
        } catch (error) {
            console.error('Error updating item:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#2D2520] rounded-2xl p-6 max-w-md w-full border border-white/10 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Edit Menu Item</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#A89B8F]" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#1A1410] border border-white/10 rounded-lg text-white placeholder-[#A89B8F] focus:outline-none focus:border-[#D4A574]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-[#1A1410] border border-white/10 rounded-lg text-white placeholder-[#A89B8F] focus:outline-none focus:border-[#D4A574] resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Price (₹)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#1A1410] border border-white/10 rounded-lg text-white placeholder-[#A89B8F] focus:outline-none focus:border-[#D4A574]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#1A1410] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4A574]"
                                >
                                    <option value="coffee">Coffee</option>
                                    <option value="tea">Tea</option>
                                    <option value="pastry">Pastry</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="sandwich">Sandwich</option>
                                    <option value="dessert">Dessert</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-2.5 px-4 bg-[#1A1410] text-white rounded-lg font-medium hover:bg-[#252019] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2.5 px-4 bg-[#D4A574] text-[#1A1410] rounded-lg font-bold hover:bg-[#C49564] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Item'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
