/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { SearchController } from '../controllers/searchController';
import { ProductController } from '../controllers/productController';
import { WishlistController } from '../controllers/wishlistController';
import { AlertController } from '../controllers/alertController';
import { AdminController } from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// ================= AUTH ROUTES =================
router.post('/auth/register', AuthController.register as any);
router.post('/auth/login', AuthController.login as any);
router.post('/auth/logout', authMiddleware as any, AuthController.logout as any);
router.get('/auth/profile', authMiddleware as any, AuthController.getProfile as any);
router.put('/auth/profile', authMiddleware as any, AuthController.updateProfile as any);
router.post('/auth/forgot-password', AuthController.forgotPassword as any);
router.post('/auth/reset-password', AuthController.resetPassword as any);
router.post('/auth/verify-email/:token', AuthController.verifyEmail as any);

// ================= SEARCH ROUTES =================
router.post('/search/natural', SearchController.naturalSearch as any); // Public but can accept optional auth
router.post('/search/semantic', SearchController.semanticSearch as any);
router.post('/search/chat', SearchController.chatWithAI as any);
router.get('/search/history', authMiddleware as any, SearchController.getSearchHistory as any);
router.delete('/search/history/:id', authMiddleware as any, SearchController.deleteSearchHistoryItem as any);
router.get('/search/trending', SearchController.getTrendingSearches as any);

// ================= PRODUCTS ROUTES =================
router.get('/products', ProductController.getAllProducts as any);
router.get('/products/:id', ProductController.getProduct as any);
router.post('/products', adminMiddleware as any, ProductController.createProduct as any);
router.put('/products/:id', adminMiddleware as any, ProductController.updateProduct as any);
router.delete('/products/:id', adminMiddleware as any, ProductController.deleteProduct as any);
router.post('/products/compare', ProductController.compareProducts as any);
router.get('/products/:id/trends', ProductController.getPriceTrends as any);
router.get('/products/:id/similar', ProductController.getSimilarProducts as any);
router.post('/products/:id/review', ProductController.addReview as any);

// ================= WISHLIST ROUTES =================
router.get('/wishlist', authMiddleware as any, WishlistController.getWishlist as any);
router.post('/wishlist', authMiddleware as any, WishlistController.addToWishlist as any);
router.delete('/wishlist/:id', authMiddleware as any, WishlistController.removeFromWishlist as any);
router.get('/wishlist/check/:productId', authMiddleware as any, WishlistController.checkInWishlist as any);
router.get('/wishlist/recommendations', authMiddleware as any, WishlistController.getWishlistRecommendations as any);

// ================= ALERTS ROUTES =================
router.get('/alerts', authMiddleware as any, AlertController.getAlerts as any);
router.post('/alerts', authMiddleware as any, AlertController.createAlert as any);
router.put('/alerts/:id', authMiddleware as any, AlertController.updateAlert as any);
router.delete('/alerts/:id', authMiddleware as any, AlertController.deleteAlert as any);
router.get('/alerts/history', authMiddleware as any, AlertController.getAlertHistory as any);
router.post('/alerts/check', AlertController.checkAlerts as any); // Can trigger check manually

// ================= ADMIN ROUTES =================
router.get('/admin/users', adminMiddleware as any, AdminController.getUsers as any);
router.get('/admin/users/:id', adminMiddleware as any, AdminController.getUserDetails as any);
router.put('/admin/users/:id', adminMiddleware as any, AdminController.updateUser as any);
router.delete('/admin/users/:id', adminMiddleware as any, AdminController.deleteUser as any);
router.get('/admin/dashboard', adminMiddleware as any, AdminController.getDashboardStats as any);
router.get('/admin/analytics/search', adminMiddleware as any, AdminController.getSearchAnalytics as any);
router.get('/admin/analytics/products', adminMiddleware as any, AdminController.getProductAnalytics as any);
router.get('/admin/analytics/platforms', adminMiddleware as any, AdminController.getPlatformAnalytics as any);
router.get('/admin/logs', adminMiddleware as any, AdminController.getSystemLogs as any);
router.get('/admin/monitor', adminMiddleware as any, AdminController.monitorAPIs as any);

export default router;
