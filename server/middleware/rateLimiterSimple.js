// 簡化版的rate limiter - 暫時移除IPv6問題
// 這個版本使用最基本的配置，避免複雜的錯誤

import rateLimit from 'express-rate-limit';

// 通用速率限制 - 非常基本的配置
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 每IP限制100次請求
  message: '請求過於頻繁，請稍後再試'
});

// SMS專用速率限制
export const smsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1分鐘 
  max: 5, // 每IP每分鐘最多5次
  message: '簡訊發送過於頻繁，請稍後再試'
});

// 登錄嘗試速率限制
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 10, // 每IP最多10次登錄嘗試
  message: '登錄嘗試過於頻繁，請稍後再試'
});

// 註冊速率限制
export const registrationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小時
  max: 3, // 每IP每小時最多3次註冊
  message: '註冊嘗試過於頻繁，請1小時後再試'
});

export default {
  general: generalRateLimit,
  sms: smsRateLimit,
  login: loginRateLimit,
  registration: registrationRateLimit
};
