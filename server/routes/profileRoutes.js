import express from 'express';
import { setupProfile, getUserProfile, updateUserProfile } from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 設置個人資料（無需認證，因為是新用戶）
router.post('/setup-profile', setupProfile);

// 獲取個人資料（需要認證）
router.get('/profile', authMiddleware, getUserProfile);

// 更新個人資料（需要認證）
router.put('/profile', authMiddleware, updateUserProfile);

export default router;
