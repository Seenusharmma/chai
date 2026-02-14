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
exports.deleteMenuItem = exports.updateMenuItem = exports.createMenuItem = exports.seedMenu = exports.getCategories = exports.getMenu = void 0;
const MenuItem_1 = __importDefault(require("../models/MenuItem"));
// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield MenuItem_1.default.find({});
        // Transform _id to id for frontend compatibility
        const transformedItems = items.map(item => (Object.assign(Object.assign({}, item.toObject()), { id: item._id.toString() })));
        res.json(transformedItems);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getMenu = getMenu;
// @desc    Get all unique categories
// @route   GET /api/menu/categories
// @access  Public
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield MenuItem_1.default.distinct('category');
        const categoryList = categories.map(cat => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1)
        }));
        res.json(categoryList);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getCategories = getCategories;
// @desc    Seed menu items
// @route   POST /api/menu/seed
// @access  Public (should be protected in prod)
const seedMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield MenuItem_1.default.deleteMany({}); // Clear existing
        yield MenuItem_1.default.insertMany(menuData);
        res.json({ message: 'Menu seeded successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.seedMenu = seedMenu;
// @desc    Create menu item
// @route   POST /api/menu
// @access  Public
const createMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const multerReq = req;
        const item = JSON.parse(req.body.data || '{}');
        if (multerReq.file) {
            item.image = multerReq.file.path;
        }
        const newItem = yield MenuItem_1.default.create(item);
        // Transform _id to id for frontend compatibility
        const transformedItem = Object.assign(Object.assign({}, newItem.toObject()), { id: newItem._id.toString() });
        res.status(201).json(transformedItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.createMenuItem = createMenuItem;
// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Public
const updateMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield MenuItem_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.updateMenuItem = updateMenuItem;
// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Public
const deleteMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield MenuItem_1.default.findByIdAndDelete(id);
        res.json({ message: 'Menu item deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.deleteMenuItem = deleteMenuItem;
