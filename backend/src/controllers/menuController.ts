import { Request, Response } from 'express';
import MenuItem, { ISize } from '../models/MenuItem';
import path from 'path';

interface MenuItemRequest {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  sizes?: ISize[];
  isVeg?: boolean;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getMenu = async (req: Request, res: Response) => {
  try {
    const items = await MenuItem.find({});
    // Transform _id to id for frontend compatibility
    const transformedItems = items.map(item => ({
      ...item.toObject(),
      id: item._id.toString()
    }));
    res.json(transformedItems);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all unique categories
// @route   GET /api/menu/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await MenuItem.distinct('category');
    const categoryList = categories.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1)
    }));
    res.json(categoryList);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Seed menu items
// @route   POST /api/menu/seed
// @access  Public (should be protected in prod)
export const seedMenu = async (req: Request, res: Response) => {
  try {
    const menuData = [
      {
        name: 'Espresso',
        description: 'Rich and bold espresso shot',
        price: 3.50,
        image: '/images/espresso.jpg',
        category: 'coffee',
        rating: 4.8,
        isPopular: true,
        isFeatured: true,
      },
      {
        name: 'Cappuccino',
        description: 'Classic cappuccino with velvety foam',
        price: 4.50,
        image: '/images/cappuccino.jpeg',
        category: 'coffee',
        rating: 4.9,
        isPopular: true,
        isFeatured: true,
      },
      {
        name: 'Latte',
        description: 'Smooth latte with steamed milk',
        price: 4.75,
        image: '/images/latte.jpg',
        category: 'coffee',
        rating: 4.7,
        isPopular: true,
      },
      {
        name: 'Matcha Latte',
        description: 'Premium matcha green tea latte',
        price: 5.25,
        image: '/images/matcha.jpg',
        category: 'tea',
        rating: 4.6,
        isPopular: true,
      },
      {
        name: 'Croissant',
        description: 'Buttery, flaky French croissant',
        price: 3.75,
        image: '/images/croissant.jpg',
        category: 'pastry',
        rating: 4.8,
        isPopular: true,
      },
      {
        name: 'Chocolate Muffin',
        description: 'Rich chocolate muffin with chocolate chips',
        price: 4.25,
        image: '/images/muffin.jpg',
        category: 'pastry',
        rating: 4.7,
      },
      {
        name: 'Avocado Toast',
        description: 'Fresh avocado on artisan bread',
        price: 7.50,
        image: '/images/avocado-toast.jpg',
        category: 'breakfast',
        rating: 4.9,
      },
      {
        name: 'Breakfast Sandwich',
        description: 'Egg, cheese, and bacon on a croissant',
        price: 6.75,
        image: '/images/breakfast-sandwich.jpg',
        category: 'sandwich',
        rating: 4.8,
      },
      {
        name: 'Green Eggplant',
        description: 'Healthy green smoothie bowl',
        price: 6.50,
        image: '/images/green-bowl.jpg',
        category: 'breakfast',
        rating: 4.5,
      },
      {
        name: 'Iced Coffee',
        description: 'Refreshing cold brew coffee',
        price: 4.00,
        image: '/images/iced-coffee.jpg',
        category: 'coffee',
        rating: 4.6,
      },
      {
        name: 'Caramel Macchiato',
        description: 'Sweet caramel espresso drink',
        price: 5.50,
        image: '/images/caramel-macchiato.jpg',
        category: 'coffee',
        rating: 4.8,
      },
      {
        name: 'Cheese Cake',
        description: 'Creamy New York style cheesecake',
        price: 5.75,
        image: '/images/cheesecake.jpg',
        category: 'dessert',
        rating: 4.9,
      },
    ];

    await MenuItem.deleteMany({}); // Clear existing
    await MenuItem.insertMany(menuData);

    res.json({ message: 'Menu seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Public
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const multerReq = req as MulterRequest;
    const item: MenuItemRequest = JSON.parse(req.body.data || '{}');
    
    if (multerReq.file) {
      item.image = multerReq.file.path;
    }
    
    const newItem = await MenuItem.create(item);
    // Transform _id to id for frontend compatibility
    const transformedItem = {
      ...newItem.toObject(),
      id: newItem._id.toString()
    };
    res.status(201).json(transformedItem);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Public
export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Public
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.json({ message: 'Menu item deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
