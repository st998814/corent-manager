import express from 'express';
import {
  createGroup,
  verifyGroupCode,
  joinGroup,
  getUserGroupMember,
  getGroupDetails,
} from '../controllers/groupController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 創建群組
router.post('/create', authMiddleware, createGroup);

 router.post('/groupinfo', authMiddleware, getUserGroupMember);

router.post('/user-groups', authMiddleware, getUserGroupMember);

// // 驗證群組代碼
// router.get('/verify/:code', authMiddleware, verifyGroupCode);

// // 獲取群組詳情
// router.get('/:groupId', authMiddleware, getGroupDetails);

// // 加入群組
// router.post('/:groupId/join', authMiddleware, joinGroup);
router.get('/user-groups', authMiddleware, getUserGroupMember);
export default router;
