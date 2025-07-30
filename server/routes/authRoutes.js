import express from 'express';
import { register, login, getUserProfile } from '../controllers/authController.js';
import { sendVerificationCode, verifySmsCode, resendVerificationCode, handleSmsStatusCallback, getVerificationStats } from '../controllers/smsControllerProd.js';
import { smsRateLimit, loginRateLimit, registrationRateLimit } from '../middleware/rateLimiterSimple.js';
import { validateSmsRequest, validateSmsVerification } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 認證相關路由
router.post('/register', registrationRateLimit, register);
router.post('/login', loginRateLimit, login);
router.get('/me', authMiddleware, getUserProfile);

// SMS驗證相關路由（使用production ready控制器）
router.post('/send-verification', smsRateLimit, validateSmsRequest, sendVerificationCode);
router.post('/verify-sms', validateSmsVerification, verifySmsCode);
router.post('/resend-sms', smsRateLimit, validateSmsRequest, resendVerificationCode);

// SMS狀態回調（Twilio webhook）
router.post('/sms/status-callback', handleSmsStatusCallback);

// 管理員統計路由
router.get('/verification-stats', authMiddleware, getVerificationStats);

export default router;