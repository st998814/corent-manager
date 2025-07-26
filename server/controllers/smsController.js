import jwt from 'jsonwebtoken';
import { sendSmsVerification } from '../services/smsService.js';

// 模擬驗證碼存儲（實際應用中使用Redis等）
const verificationCodes = new Map();

// 生成隨機驗證碼
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 發送SMS驗證碼
export const sendVerificationCode = async (req, res) => {
  try {
    const { phone, inviteToken } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: '手機號碼是必填字段'
      });
    }

    // 驗證手機號碼格式
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: '請輸入有效的手機號碼格式'
      });
    }

    // 生成驗證碼
    const verificationCode = generateVerificationCode();
    
    // 設置驗證碼過期時間（5分鐘）
    const expiresAt = Date.now() + 5 * 60 * 1000;
    
    // 存儲驗證碼
    verificationCodes.set(phone, {
      code: verificationCode,
      expiresAt,
      attempts: 0,
      maxAttempts: 3
    });

    // 發送SMS
    const smsResult = await sendSmsVerification(phone, verificationCode);

    console.log('📱 驗證碼已發送:', {
      phone,
      code: verificationCode, // 實際環境中不應該記錄
      provider: smsResult.provider
    });

    res.json({
      message: '驗證碼已發送',
      smsSent: smsResult.success,
      provider: smsResult.provider,
      ...(smsResult.provider === 'mock' && {
        mockMessage: `驗證碼: ${verificationCode} (模擬發送)`
      })
    });

  } catch (error) {
    console.error('❌ 發送驗證碼錯誤:', error);
    res.status(500).json({
      message: '發送驗證碼失敗，請稍後重試'
    });
  }
};

// 驗證SMS驗證碼
export const verifySmsCode = async (req, res) => {
  try {
    const { phone, verificationCode, inviteToken } = req.body;

    if (!phone || !verificationCode) {
      return res.status(400).json({
        message: '手機號碼和驗證碼都是必填字段'
      });
    }

    // 獲取存儲的驗證碼信息
    const storedInfo = verificationCodes.get(phone);

    if (!storedInfo) {
      return res.status(400).json({
        message: '驗證碼不存在或已過期，請重新獲取'
      });
    }

    // 檢查驗證碼是否過期
    if (Date.now() > storedInfo.expiresAt) {
      verificationCodes.delete(phone);
      return res.status(400).json({
        message: '驗證碼已過期，請重新獲取'
      });
    }

    // 檢查嘗試次數
    if (storedInfo.attempts >= storedInfo.maxAttempts) {
      verificationCodes.delete(phone);
      return res.status(400).json({
        message: '驗證次數過多，請重新獲取驗證碼'
      });
    }

    // 驗證碼錯誤
    if (storedInfo.code !== verificationCode) {
      storedInfo.attempts += 1;
      verificationCodes.set(phone, storedInfo);
      
      return res.status(400).json({
        message: `驗證碼錯誤，還有 ${storedInfo.maxAttempts - storedInfo.attempts} 次機會`
      });
    }

    // 驗證成功，清除驗證碼
    verificationCodes.delete(phone);

    console.log('✅ 簡訊驗證成功:', { phone });

    res.json({
      message: '驗證成功',
      verified: true,
      phone
    });

  } catch (error) {
    console.error('❌ 驗證簡訊錯誤:', error);
    res.status(500).json({
      message: '驗證失敗，請稍後重試'
    });
  }
};

// 重新發送驗證碼
export const resendVerificationCode = async (req, res) => {
  try {
    const { phone, inviteToken } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: '手機號碼是必填字段'
      });
    }

    // 清除舊的驗證碼
    verificationCodes.delete(phone);

    // 重新發送驗證碼
    return await sendVerificationCode(req, res);

  } catch (error) {
    console.error('❌ 重新發送驗證碼錯誤:', error);
    res.status(500).json({
      message: '重新發送失敗，請稍後重試'
    });
  }
};
