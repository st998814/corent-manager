import express from 'express';
import { getUserProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 獲取用戶資料
router.get('/profile', authMiddleware, getUserProfile);

export default router;