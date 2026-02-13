'use client';

import { useState, useRef } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Category, Size } from '@/lib/types';

interface FoodUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories: Category[] = ['coffee', 'tea', 'pastry', 'sandwich', 'dessert', 'breakfast'];

export function FoodUploadForm({ isOpen, onClose, onSuccess }: FoodUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee' as Category,
    isPopular: false,
    isFeatured: false,
    isVeg: true,
  });
  const [sizes, setSizes] = useState<Size[]>([
    { name: 'small', price: 0 },
    { name: 'medium', price: 0 },
    { name: 'large', price: 0 },
  ]);
  const [hasSizes, setHasSizes] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('data', JSON.stringify({
        ...formData,
        price: Number(formData.price),
        sizes: hasSizes ? sizes : undefined,
      }));

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(file, options);
          data.append('image', compressedFile);
        } catch (error) {
          console.error('Error compressing image:', error);
          data.append('image', file); // Fallback to original
        }
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        console.error('Error creating menu item');
      }
    } catch (error) {
      console.error('Error creating menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'coffee',
      isPopular: false,
      isFeatured: false,
      isVeg: true,
    });
    setSizes([
      { name: 'small', price: 0 },
      { name: 'medium', price: 0 },
      { name: 'large', price: 0 },
    ]);
    setHasSizes(false);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSizePriceChange = (index: number, price: string) => {
    const newSizes = [...sizes];
    newSizes[index].price = Number(price) || 0;
    setSizes(newSizes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[#2D2520] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#2D2520] flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Add Food Item</h2>
          <button onClick={onClose} className="p-1 text-[#A89B8F] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs text-[#A89B8F] mb-1.5">Food Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#1A1410] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
              placeholder="Enter food name"
            />
          </div>

          <div>
            <label className="block text-xs text-[#A89B8F] mb-1.5">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#1A1410] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
              placeholder="Enter description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#A89B8F] mb-1.5">Price (₹)</label>
              <input
                type="number"
                required={!hasSizes}
                disabled={hasSizes}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1410] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A89B8F] mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-3 py-2 bg-[#1A1410] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#1A1410]">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#A89B8F] mb-1.5">Image</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center justify-center w-16 h-16 bg-[#1A1410] border border-white/10 rounded-lg cursor-pointer hover:border-[#D4A574] transition-colors overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-5 h-5 text-[#A89B8F]" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-[#A89B8F]">Click to upload image</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasSizes}
                onChange={(e) => setHasSizes(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#1A1410] text-[#D4A574] focus:ring-[#D4A574]"
              />
              <span className="text-xs text-white">Has Sizes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVeg}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-[#1A1410] text-[#D4A574] focus:ring-[#D4A574]"
              />
              <span className="text-xs text-white">Vegetarian</span>
            </label>
          </div>

          {hasSizes && (
            <div className="bg-[#1A1410] p-3 rounded-lg space-y-3">
              <p className="text-xs text-[#A89B8F] font-medium">Size Prices</p>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((size, index) => (
                  <div key={size.name}>
                    <label className="block text-[10px] text-[#A89B8F] mb-1 capitalize">
                      {size.name}
                    </label>
                    <input
                      type="number"
                      value={size.price || ''}
                      onChange={(e) => handleSizePriceChange(index, e.target.value)}
                      className="w-full px-2 py-1.5 bg-[#2D2520] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#D4A574]"
                      placeholder="₹0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-[#1A1410] text-[#D4A574] focus:ring-[#D4A574]"
              />
              <span className="text-xs text-white">Popular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-[#1A1410] text-[#D4A574] focus:ring-[#D4A574]"
              />
              <span className="text-xs text-white">Featured</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#D4A574] text-[#1A1410] font-semibold rounded-lg hover:bg-[#C49564] transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
