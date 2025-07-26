import appConfig from '../config/ConfigIndex.js';
import { logSmsEvent, logError } from '../utils/logger.js';
import crypto from 'crypto';

// 延遲載入Twilio以避免配置錯誤
let twilioClient = null;

const initializeTwilio = async () => {
  if (twilioClient) return twilioClient;
  
  if (!appConfig.sms.enabled) {
    return null;
  }
  
  try {
    const { default: Twilio } = await import('twilio');
    twilioClient = Twilio(appConfig.sms.accountSid, appConfig.sms.authToken);
    logSmsEvent('TWILIO_INITIALIZED', null, { 
      accountSid: appConfig.sms.accountSid.substring(0, 8) + '...' 
    });
    return twilioClient;
  } catch (error) {
    logError(error, { context: 'TWILIO_INITIALIZATION' });
    return null;
  }
};

// 驗證碼生成器（加強版）
export const generateVerificationCode = () => {
  // 生成加密安全的隨機數
  const buffer = crypto.randomBytes(3);
  const code = parseInt(buffer.toString('hex'), 16) % 1000000;
  return code.toString().padStart(6, '0');
};

// 格式化電話號碼
const formatPhoneNumber = (phone) => {
  // 移除所有非數字字符
  let cleaned = phone.replace(/\D/g, '');
  
  // 如果沒有國際區號，假設是台灣號碼
  if (!phone.startsWith('+') && cleaned.length === 10) {
    cleaned = '886' + cleaned.substring(1);
  } else if (phone.startsWith('+')) {
    cleaned = phone.substring(1).replace(/\D/g, '');
  }
  
  return '+' + cleaned;
};

// 驗證電話號碼格式
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// 發送SMS驗證碼
export const sendSmsVerification = async (phone, verificationCode, options = {}) => {
  const startTime = Date.now();
  const formattedPhone = formatPhoneNumber(phone);
  
  try {
    // 驗證電話號碼格式
    if (!validatePhoneNumber(formattedPhone)) {
      throw new Error('Invalid phone number format');
    }
    
    const client = await initializeTwilio();
    
    if (!client) {
      // 使用模擬服務
      logSmsEvent('MOCK_VERIFICATION_SENT', formattedPhone, {
        code: verificationCode,
        responseTime: Date.now() - startTime
      });
      
      return {
        success: true,
        provider: 'mock',
        messageId: `mock_${Date.now()}`,
        cost: 0,
        responseTime: Date.now() - startTime
      };
    }
    
    // 構建SMS消息
    const message = options.customMessage || 
      `您的驗證碼是：${verificationCode}。此驗證碼將在${Math.floor(appConfig.sms.verificationExpiry / 60)}分鐘後過期。如非本人操作，請忽略此消息。`;
    
    // 發送真實SMS
    const result = await client.messages.create({
      body: message,
      from: appConfig.sms.phoneNumber,
      to: formattedPhone,
      // 添加Twilio的其他選項
      validityPeriod: appConfig.sms.verificationExpiry,
      ...(options.statusCallback && { statusCallback: options.statusCallback })
    });
    
    logSmsEvent('VERIFICATION_SENT', formattedPhone, {
      messageId: result.sid,
      status: result.status,
      direction: result.direction,
      responseTime: Date.now() - startTime,
      cost: result.price || 0
    });
    
    return {
      success: true,
      provider: 'twilio',
      messageId: result.sid,
      status: result.status,
      cost: result.price || 0,
      responseTime: Date.now() - startTime
    };
    
  } catch (error) {
    logError(error, {
      context: 'SMS_VERIFICATION',
      phone: formattedPhone,
      responseTime: Date.now() - startTime
    });
    
    // 如果Twilio失敗，回退到模擬服務
    if (error.code && error.code.toString().startsWith('2')) { // Twilio錯誤碼
      logSmsEvent('TWILIO_ERROR_FALLBACK', formattedPhone, {
        error: error.message,
        code: error.code
      });
      
      return {
        success: true,
        provider: 'mock_fallback',
        messageId: `fallback_${Date.now()}`,
        cost: 0,
        responseTime: Date.now() - startTime,
        note: 'Twilio服務暫時不可用，使用模擬服務'
      };
    }
    
    throw error;
  }
};

// 發送邀請SMS
export const sendInvitationSms = async (phone, name, inviteToken, options = {}) => {
  const startTime = Date.now();
  const formattedPhone = formatPhoneNumber(phone);
  
  try {
    if (!validatePhoneNumber(formattedPhone)) {
      throw new Error('Invalid phone number format');
    }
    
    const client = await initializeTwilio();
    
    // 構建邀請鏈接
    const inviteLink = options.baseUrl ? 
      `${options.baseUrl}/invite?token=${inviteToken}` :
      `https://yourapp.com/invite?token=${inviteToken}`;
    
    const message = options.customMessage ||
      `${name}，您被邀請加入房屋群組！請點擊鏈接完成註冊：${inviteLink}。如非本人操作，請忽略此消息。`;
    
    if (!client) {
      // 模擬邀請SMS
      logSmsEvent('MOCK_INVITATION_SENT', formattedPhone, {
        invitee: name,
        inviteToken: inviteToken.substring(0, 20) + '...',
        responseTime: Date.now() - startTime
      });
      
      return {
        success: true,
        provider: 'mock',
        messageId: `mock_invite_${Date.now()}`,
        cost: 0,
        responseTime: Date.now() - startTime
      };
    }
    
    // 發送真實邀請SMS
    const result = await client.messages.create({
      body: message,
      from: appConfig.sms.phoneNumber,
      to: formattedPhone,
      ...(options.statusCallback && { statusCallback: options.statusCallback })
    });
    
    logSmsEvent('INVITATION_SENT', formattedPhone, {
      invitee: name,
      messageId: result.sid,
      status: result.status,
      responseTime: Date.now() - startTime,
      cost: result.price || 0
    });
    
    return {
      success: true,
      provider: 'twilio',
      messageId: result.sid,
      status: result.status,
      cost: result.price || 0,
      responseTime: Date.now() - startTime
    };
    
  } catch (error) {
    logError(error, {
      context: 'SMS_INVITATION',
      phone: formattedPhone,
      invitee: name,
      responseTime: Date.now() - startTime
    });
    
    // 回退到模擬服務
    if (error.code && error.code.toString().startsWith('2')) {
      logSmsEvent('TWILIO_ERROR_FALLBACK', formattedPhone, {
        error: error.message,
        code: error.code,
        invitee: name
      });
      
      return {
        success: true,
        provider: 'mock_fallback',
        messageId: `fallback_invite_${Date.now()}`,
        cost: 0,
        responseTime: Date.now() - startTime,
        note: 'Twilio服務暫時不可用，使用模擬服務'
      };
    }
    
    throw error;
  }
};

// 檢查SMS發送狀態
export const checkSmsStatus = async (messageId) => {
  try {
    const client = await initializeTwilio();
    
    if (!client || messageId.startsWith('mock')) {
      return {
        status: 'delivered',
        provider: 'mock'
      };
    }
    
    const message = await client.messages(messageId).fetch();
    
    return {
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      dateUpdated: message.dateUpdated,
      price: message.price,
      provider: 'twilio'
    };
    
  } catch (error) {
    logError(error, {
      context: 'SMS_STATUS_CHECK',
      messageId
    });
    
    return {
      status: 'unknown',
      error: error.message
    };
  }
};

// 獲取SMS發送統計
export const getSmsStats = async (startDate, endDate) => {
  try {
    const client = await initializeTwilio();
    
    if (!client) {
      return {
        totalMessages: 0,
        totalCost: 0,
        provider: 'mock',
        note: 'Twilio not configured'
      };
    }
    
    const messages = await client.messages.list({
      dateSentAfter: startDate,
      dateSentBefore: endDate,
      limit: 1000
    });
    
    const stats = messages.reduce((acc, msg) => {
      acc.totalMessages++;
      acc.totalCost += parseFloat(msg.price || 0);
      acc.statusCounts[msg.status] = (acc.statusCounts[msg.status] || 0) + 1;
      return acc;
    }, {
      totalMessages: 0,
      totalCost: 0,
      statusCounts: {},
      provider: 'twilio'
    });
    
    return stats;
    
  } catch (error) {
    logError(error, { context: 'SMS_STATS' });
    return {
      error: error.message
    };
  }
};
