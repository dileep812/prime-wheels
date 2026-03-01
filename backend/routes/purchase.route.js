import express from 'express';
import {
  createPurchase,
  getUserPurchases,
  getPurchaseById,
  getAllPurchases,
  getPurchaseByCarId
} from '../controllers/purchase.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create a new purchase
router.post('/create', verifyToken, createPurchase);

// Get all purchases for a specific user
router.get('/user/:userId', verifyToken, getUserPurchases);

// Get purchase by car ID
router.get('/car/:carId', verifyToken, getPurchaseByCarId);

// Get a specific purchase by ID
router.get('/:id', verifyToken, getPurchaseById);

// Get all purchases (admin only)
router.get('/', verifyToken, getAllPurchases);

export default router;
