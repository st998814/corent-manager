import express from 'express';
import jwt from 'jsonwebtoken';
import { sendInvitation ,acceptInvitation} from '../controllers/memberController.js';

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

  try {
    // 驗證 JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-for-development');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: '無效的授權令牌'
    });
  }
};

router.post('/invite', authenticateToken, sendInvitation);
router.patch('/invite/accept', acceptInvitation);

export default router;