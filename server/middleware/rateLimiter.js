import rateLimit from 'express-rate-limit';
import { appConfig } from '../config/ConfigIndex.js';
import { logSecurityEvent } from '../utils/logger.js';

// 通用速率限制
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 100, // 每個IP每15分鐘最多100個請求
  message: {
    error: '請求過於頻繁，請稍後再試',
    retryAfter: 900 // 15分鐘後重試
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // 跳過某些路由
    const skipPaths = ['/health', '/api/health'];
    return skipPaths.includes(req.path);
  },
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      error: '請求過於頻繁，請稍後再試',
      retryAfter: 900
    });
  }
});

// SMS專用速率限制
export const smsRateLimit = rateLimit({
  windowMs: appConfig.sms.cooldown * 1000, // SMS冷卻時間
  max: appConfig.sms.rateLimit,
  // 移除自定義keyGenerator，使用默認的IP限制
  message: {
    error: '簡訊發送過於頻繁，請稍後再試',
    retryAfter: appConfig.sms.cooldown
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const phone = req.body.phone;
    logSecurityEvent('SMS_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      phone: phone,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      error: '簡訊發送過於頻繁，請稍後再試',
      retryAfter: appConfig.sms.cooldown
    });
  }
});

// 登錄嘗試速率限制
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: appConfig.security.maxLoginAttempts,
  message: {
    error: '登錄嘗試過於頻繁，請稍後再試',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const identifier = req.body.phone || req.body.email || 'unknown';
    logSecurityEvent('LOGIN_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      identifier: identifier,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      error: '登錄嘗試過於頻繁，請稍後再試',
      retryAfter: 900,
      lockoutTime: appConfig.security.lockoutTime * 60
    });
  }
});

// 註冊速率限制
export const registrationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小時
  max: 3, // 每小時最多3次註冊嘗試
  message: {
    error: '註冊嘗試過於頻繁，請1小時後再試',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('REGISTRATION_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      error: '註冊嘗試過於頻繁，請1小時後再試',
      retryAfter: 3600
    });
  }
});

// API端點專用速率限制
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 200, // API調用限制更寬鬆
  message: {
    error: 'API調用過於頻繁，請稍後再試',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 嚴格的安全端點限制
export const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小時
  max: 5, // 每小時最多5次
  message: {
    error: '敏感操作頻率限制，請稍後再試',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('STRICT_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      error: '敏感操作頻率限制，請稍後再試',
      retryAfter: 3600
    });
  }
});

export default {
  general: generalRateLimit,
  sms: smsRateLimit,
  login: loginRateLimit,
  registration: registrationRateLimit,
  api: apiRateLimit,
  strict: strictRateLimit
};
