'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Image } from 'lucide-react';
import axios from 'axios';
import { compressImage } from '@/lib/utils/imageCompression';
import { Category } from '@/lib/types';

const categories: Category[] = [
  'biriyani', 'chicken', 'mutton', 'egg', 'veg', 'rice', 'roti', 'roll',
  'soup', 'noodles', 'bread', 'sandwich', 'burger', 'momo', 'salad',
  'tea', 'coffee', 'mocktails', 'maggie'
];

const categoryLabels: Record<Category, string> = {
  biriyani: 'Biriyani',
  chicken: 'Chicken',
  mutton: 'Mutton',
  egg: 'Egg',
  veg: 'Veg',
  rice: 'Rice',
  roti: 'Roti',
  roll: 'Roll',
  soup: 'Soup',
  noodles: 'Noodles',
  bread: 'Bread',
  sandwich: 'Sandwich',
  burger: 'Burger',
  momo: 'Momo',
  salad: 'Salad',
  tea: 'Tea',
  coffee: 'Coffee',
  mocktails: 'Mocktails',
  maggie: 'Maggie',
};

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
        category: item.category || 'biriyani',
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>(item.image || '');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    }, [processFile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            
            const file = fileInputRef.current?.files?.[0];
            if (file) {
                const formDataWithImage = new FormData();
                formDataWithImage.append('data', JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                }));
                
                const compressedFile = await compressImage(file);
                formDataWithImage.append('image', compressedFile);
                
                await axios.put(`${API_URL}/menu/${item.id}`, formDataWithImage);
            } else {
                await axios.put(`${API_URL}/menu/${item.id}`, formData);
            }
            
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
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-[#1A1410]">
                                            {categoryLabels[cat]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Image
                                </label>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                                        isDragging 
                                            ? 'border-[#D4A574] bg-[#D4A574]/10' 
                                            : 'border-white/10 hover:border-[#D4A574]'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center justify-center w-20 h-20 bg-[#1A1410] border border-white/10 rounded-lg cursor-pointer hover:border-[#D4A574] transition-colors overflow-hidden flex-shrink-0">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <Image className="w-6 h-6 text-[#A89B8F]" />
                                                    <span className="text-[10px] text-[#A89B8F]">Add</span>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[#A89B8F]">Click or drag & drop image</span>
                                            <span className="text-[10px] text-[#A89B8F]/60">PNG, JPG up to 5MB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#A89B8F]">Food Type:</span>
                                <div className="flex rounded-lg overflow-hidden border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isVeg: true })}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                                            formData.isVeg
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-[#1A1410] text-[#A89B8F] hover:bg-[#2D2520]'
                                        }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Veg
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isVeg: false })}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                                            !formData.isVeg
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                : 'bg-[#1A1410] text-[#A89B8F] hover:bg-[#2D2520]'
                                        }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        Non-Veg
                                    </button>
                                </div>
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
