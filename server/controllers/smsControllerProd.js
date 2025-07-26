import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import appConfig from '../config/index.js';
import { sendSmsVerification } from '../services/smsServiceProd.js';
import { logAuthEvent, logSecurityEvent, logError, logPerformance } from '../utils/logger.js';

// 模擬驗證碼存儲（生產環境應使用Redis）
const verificationCodes = new Map();
const rateLimitTracker = new Map();

// 清理過期驗證碼的定時任務
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(phone);
    }
  }
  
  // 清理速率限制追蹤器
  for (const [key, data] of rateLimitTracker.entries()) {
    if (now > data.resetTime) {
      rateLimitTracker.delete(key);
    }
  }
}, 60000); // 每分鐘清理一次

// 生成加密安全的驗證碼
const generateSecureVerificationCode = () => {
  const buffer = crypto.randomBytes(3);
  const code = parseInt(buffer.toString('hex'), 16) % 1000000;
  return code.toString().padStart(6, '0');
};

// 檢查速率限制
const checkRateLimit = (phone, action) => {
  const key = `${phone}:${action}`;
  const now = Date.now();
  const data = rateLimitTracker.get(key);
  
  if (!data) {
    rateLimitTracker.set(key, {
      count: 1,
      resetTime: now + appConfig.sms.cooldown * 1000
    });
    return true;
  }
  
  if (now > data.resetTime) {
    rateLimitTracker.set(key, {
      count: 1,
      resetTime: now + appConfig.sms.cooldown * 1000
    });
    return true;
  }
  
  if (data.count >= appConfig.sms.rateLimit) {
    return false;
  }
  
  data.count++;
  return true;
};

// 發送SMS驗證碼
export const sendVerificationCode = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { phone, inviteToken } = req.body;
    const clientIp = req.ip;
    const userAgent = req.get('User-Agent');
    
    // 檢查速率限制
    if (!checkRateLimit(phone, 'verification')) {
      logSecurityEvent('SMS_RATE_LIMIT_EXCEEDED', {
        phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
        ip: clientIp,
        userAgent
      });
      
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `每${appConfig.sms.cooldown}秒內最多只能發送${appConfig.sms.rateLimit}條驗證碼`,
        retryAfter: appConfig.sms.cooldown
      });
    }
    
    // 生成驗證碼
    const verificationCode = generateSecureVerificationCode();
    
    // 設置驗證碼過期時間
    const expiresAt = Date.now() + appConfig.sms.verificationExpiry * 1000;
    
    // 存儲驗證碼（加密存儲）
    const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');
    
    verificationCodes.set(phone, {
      hashedCode,
      expiresAt,
      attempts: 0,
      maxAttempts: 3,
      createdAt: Date.now(),
      ip: clientIp
    });
    
    // 發送SMS
    const smsResult = await sendSmsVerification(phone, verificationCode, {
      statusCallback: `${req.protocol}://${req.get('host')}/api/sms/status-callback`
    });
    
    logAuthEvent('VERIFICATION_CODE_SENT', null, {
      phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
      provider: smsResult.provider,
      messageId: smsResult.messageId,
      cost: smsResult.cost,
      responseTime: smsResult.responseTime,
      ip: clientIp
    });
    
    // 記錄性能指標
    logPerformance('SMS_SEND', Date.now() - startTime, {
      provider: smsResult.provider,
      success: true
    });
    
    res.json({
      message: '驗證碼已發送',
      smsSent: smsResult.success,
      provider: smsResult.provider,
      messageId: smsResult.messageId,
      expiresIn: appConfig.sms.verificationExpiry,
      ...(smsResult.provider === 'mock' && {
        mockMessage: `驗證碼: ${verificationCode} (模擬發送)`
      }),
      ...(smsResult.note && { note: smsResult.note })
    });
    
  } catch (error) {
    logError(error, {
      context: 'SEND_VERIFICATION_CODE',
      phone: req.body.phone,
      ip: req.ip,
      responseTime: Date.now() - startTime
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: '發送驗證碼失敗，請稍後重試',
      code: 'SMS_SEND_FAILED'
    });
  }
};

// 驗證SMS驗證碼
export const verifySmsCode = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { phone, verificationCode, inviteToken } = req.body;
    const clientIp = req.ip;
    
    // 獲取存儲的驗證碼信息
    const storedInfo = verificationCodes.get(phone);
    
    if (!storedInfo) {
      logSecurityEvent('VERIFICATION_CODE_NOT_FOUND', {
        phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
        ip: clientIp
      });
      
      return res.status(400).json({
        error: 'Verification code not found',
        message: '驗證碼不存在或已過期，請重新獲取',
        code: 'CODE_NOT_FOUND'
      });
    }
    
    // 檢查驗證碼是否過期
    if (Date.now() > storedInfo.expiresAt) {
      verificationCodes.delete(phone);
      
      logSecurityEvent('VERIFICATION_CODE_EXPIRED', {
        phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
        ip: clientIp,
        expiredAt: new Date(storedInfo.expiresAt).toISOString()
      });
      
      return res.status(400).json({
        error: 'Verification code expired',
        message: '驗證碼已過期，請重新獲取',
        code: 'CODE_EXPIRED'
      });
    }
    
    // 檢查嘗試次數
    if (storedInfo.attempts >= storedInfo.maxAttempts) {
      verificationCodes.delete(phone);
      
      logSecurityEvent('VERIFICATION_ATTEMPTS_EXCEEDED', {
        phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
        ip: clientIp,
        attempts: storedInfo.attempts
      });
      
      return res.status(400).json({
        error: 'Too many attempts',
        message: '驗證次數過多，請重新獲取驗證碼',
        code: 'TOO_MANY_ATTEMPTS'
      });
    }
    
    // 驗證碼哈希比較
    const hashedInput = crypto.createHash('sha256').update(verificationCode).digest('hex');
    
    if (storedInfo.hashedCode !== hashedInput) {
      storedInfo.attempts += 1;
      verificationCodes.set(phone, storedInfo);
      
      logSecurityEvent('VERIFICATION_CODE_MISMATCH', {
        phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
        ip: clientIp,
        attempts: storedInfo.attempts,
        remainingAttempts: storedInfo.maxAttempts - storedInfo.attempts
      });
      
      return res.status(400).json({
        error: 'Invalid verification code',
        message: `驗證碼錯誤，還有 ${storedInfo.maxAttempts - storedInfo.attempts} 次機會`,
        code: 'INVALID_CODE',
        remainingAttempts: storedInfo.maxAttempts - storedInfo.attempts
      });
    }
    
    // 驗證成功，清除驗證碼
    verificationCodes.delete(phone);
    
    logAuthEvent('SMS_VERIFICATION_SUCCESS', null, {
      phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
      ip: clientIp,
      verificationTime: Date.now() - storedInfo.createdAt
    });
    
    // 記錄性能指標
    logPerformance('SMS_VERIFICATION', Date.now() - startTime, {
      success: true
    });
    
    res.json({
      message: '驗證成功',
      verified: true,
      phone,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logError(error, {
      context: 'VERIFY_SMS_CODE',
      phone: req.body.phone,
      ip: req.ip,
      responseTime: Date.now() - startTime
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: '驗證失敗，請稍後重試',
      code: 'VERIFICATION_FAILED'
    });
  }
};

// 重新發送驗證碼
export const resendVerificationCode = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { phone, inviteToken } = req.body;
    const clientIp = req.ip;
    
    // 檢查是否太頻繁重發
    const existingCode = verificationCodes.get(phone);
    if (existingCode) {
      const timeSinceCreation = Date.now() - existingCode.createdAt;
      const minResendInterval = 30 * 1000; // 30秒最小間隔
      
      if (timeSinceCreation < minResendInterval) {
        logSecurityEvent('RESEND_TOO_FREQUENT', {
          phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
          ip: clientIp,
          timeSinceCreation
        });
        
        return res.status(429).json({
          error: 'Resend too frequent',
          message: '重發請求過於頻繁，請稍後再試',
          retryAfter: Math.ceil((minResendInterval - timeSinceCreation) / 1000)
        });
      }
    }
    
    // 清除舊的驗證碼
    verificationCodes.delete(phone);
    
    // 重新發送（復用發送邏輯）
    req.body = { phone, inviteToken };
    return await sendVerificationCode(req, res);
    
  } catch (error) {
    logError(error, {
      context: 'RESEND_VERIFICATION_CODE',
      phone: req.body.phone,
      ip: req.ip,
      responseTime: Date.now() - startTime
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: '重新發送失敗，請稍後重試',
      code: 'RESEND_FAILED'
    });
  }
};

// SMS狀態回調處理
export const handleSmsStatusCallback = async (req, res) => {
  try {
    const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = req.body;
    
    logAuthEvent('SMS_STATUS_CALLBACK', null, {
      messageId: MessageSid,
      status: MessageStatus,
      errorCode: ErrorCode,
      errorMessage: ErrorMessage
    });
    
    // 這裡可以更新數據庫中的SMS狀態
    // 或者觸發其他業務邏輯
    
    res.status(200).send('OK');
    
  } catch (error) {
    logError(error, { context: 'SMS_STATUS_CALLBACK' });
    res.status(500).send('Error');
  }
};

// 獲取驗證碼統計信息（管理員用）
export const getVerificationStats = async (req, res) => {
  try {
    const stats = {
      activeVerifications: verificationCodes.size,
      rateLimitEntries: rateLimitTracker.size,
      timestamp: new Date().toISOString()
    };
    
    res.json(stats);
    
  } catch (error) {
    logError(error, { context: 'GET_VERIFICATION_STATS' });
    res.status(500).json({
      error: 'Internal server error',
      message: '獲取統計信息失敗'
    });
  }
};
