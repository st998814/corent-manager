import { body, param, query, validationResult } from 'express-validator';
import { logSecurityEvent } from '../utils/logger.js';

// 驗證結果處理中間件
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // 記錄驗證失敗事件
    logSecurityEvent('VALIDATION_FAILED', {
      ip: req.ip,
      path: req.path,
      errors: errors.array(),
      body: req.body // 注意：生產環境中可能需要過濾敏感信息
    });
    
    return res.status(400).json({
      error: 'Validation failed',
      message: '輸入數據驗證失敗',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// 電話號碼驗證
export const validatePhone = [
  body('phone')
    .notEmpty()
    .withMessage('電話號碼不能為空')
    .isLength({ min: 8, max: 20 })
    .withMessage('電話號碼長度必須在8-20字符之間')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('請輸入有效的電話號碼格式（可包含國際區號）')
    .customSanitizer(value => {
      // 統一電話號碼格式
      return value.replace(/\s+/g, '').replace(/[()-]/g, '');
    }),
  handleValidationErrors
];

// Email驗證
export const validateEmail = [
  body('email')
    .notEmpty()
    .withMessage('Email不能為空')
    .isEmail()
    .withMessage('請輸入有效的Email格式')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email長度不能超過254字符'),
  handleValidationErrors
];

// 姓名驗證
export const validateName = [
  body('name')
    .notEmpty()
    .withMessage('姓名不能為空')
    .isLength({ min: 1, max: 50 })
    .withMessage('姓名長度必須在1-50字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/)
    .withMessage('姓名只能包含中文、英文字母和空格')
    .trim(),
  handleValidationErrors
];

// 驗證碼驗證
export const validateVerificationCode = [
  body('verificationCode')
    .notEmpty()
    .withMessage('驗證碼不能為空')
    .isLength({ min: 6, max: 6 })
    .withMessage('驗證碼必須是6位數字')
    .isNumeric()
    .withMessage('驗證碼只能包含數字'),
  handleValidationErrors
];

// JWT token驗證
export const validateToken = [
  body('token')
    .optional()
    .isJWT()
    .withMessage('無效的token格式'),
  handleValidationErrors
];

// 密碼驗證（如果需要）
export const validatePassword = [
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('密碼長度必須在8-128字符之間')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('密碼必須包含至少一個小寫字母、一個大寫字母、一個數字和一個特殊字符'),
  handleValidationErrors
];

// 組合驗證：SMS發送
export const validateSmsRequest = [
  ...validatePhone,
  body('inviteToken')
    .optional()
    .isJWT()
    .withMessage('無效的邀請token格式')
];

// 組合驗證：SMS驗證
export const validateSmsVerification = [
  ...validatePhone,
  ...validateVerificationCode,
  body('inviteToken')
    .optional()
    .isJWT()
    .withMessage('無效的邀請token格式')
];

// 組合驗證：個人資料設置
export const validateProfileSetup = [
  ...validatePhone,
  ...validateName,
  ...validateEmail,
  body('inviteToken')
    .optional()
    .isJWT()
    .withMessage('無效的邀請token格式')
];

// 組合驗證：個人資料更新
export const validateProfileUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('姓名長度必須在1-50字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/)
    .withMessage('姓名只能包含中文、英文字母和空格')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('請輸入有效的Email格式')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email長度不能超過254字符'),
  handleValidationErrors
];

// 組合驗證：邀請成員
export const validateMemberInvite = [
  ...validateName,
  ...validatePhone,
  handleValidationErrors
];

// URL參數驗證
export const validateUserId = [
  param('userId')
    .notEmpty()
    .withMessage('用戶ID不能為空')
    .isLength({ min: 1, max: 50 })
    .withMessage('用戶ID格式不正確'),
  handleValidationErrors
];

// 查詢參數驗證
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('頁碼必須是大於0的整數'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每頁數量必須在1-100之間'),
  handleValidationErrors
];

// 安全頭部驗證
export const validateSecurityHeaders = (req, res, next) => {
  // 檢查可疑的User-Agent
  const userAgent = req.get('User-Agent');
  if (!userAgent || userAgent.length > 512) {
    logSecurityEvent('SUSPICIOUS_USER_AGENT', {
      ip: req.ip,
      userAgent: userAgent ? userAgent.substring(0, 100) + '...' : 'missing'
    });
  }
  
  // 檢查可疑的請求頭
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-originating-ip'];
  suspiciousHeaders.forEach(header => {
    const value = req.get(header);
    if (value && !/^[\d\.,\s:]+$/.test(value)) {
      logSecurityEvent('SUSPICIOUS_HEADER', {
        ip: req.ip,
        header,
        value: value.substring(0, 100)
      });
    }
  });
  
  next();
};

// 內容類型驗證
export const validateContentType = (expectedTypes = ['application/json']) => {
  return (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const contentType = req.get('Content-Type');
      
      if (!contentType || !expectedTypes.some(type => contentType.includes(type))) {
        logSecurityEvent('INVALID_CONTENT_TYPE', {
          ip: req.ip,
          path: req.path,
          contentType,
          expected: expectedTypes
        });
        
        return res.status(400).json({
          error: 'Invalid content type',
          message: '請使用正確的Content-Type',
          expected: expectedTypes
        });
      }
    }
    
    next();
  };
};
