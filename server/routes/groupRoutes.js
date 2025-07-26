import express from 'express';
import {
  createGroup,
  verifyGroupCode,
  joinGroup,
  getUserGroups,
  getGroupDetails,
} from '../controllers/groupController.js';

const router = express.Router();

// 中間件 - 驗證 JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '需要登入才能執行此操作'
    });
  }

  // 簡化的 token 驗證（實際應用中應使用 JWT 驗證）
  // 這裡假設 token 包含用戶資訊
  req.user = { id: 'user1', username: 'testuser' }; // 臨時模擬用戶
  next();
};

// 創建群組
router.post('/', authenticateToken, createGroup);

// 獲取用戶的群組列表
router.get('/', authenticateToken, getUserGroups);

// 驗證群組代碼
router.get('/verify/:code', authenticateToken, verifyGroupCode);

// 獲取群組詳情
router.get('/:groupId', authenticateToken, getGroupDetails);

// 加入群組
router.post('/:groupId/join', authenticateToken, joinGroup);

export default router;
