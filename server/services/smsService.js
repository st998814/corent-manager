import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// 懶加載初始化 Twilio 客戶端
const createTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || 
      !process.env.TWILIO_AUTH_TOKEN || 
      process.env.TWILIO_ACCOUNT_SID === 'your-twilio-account-sid') {
    return null;
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

// 生成6位數驗證碼
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 發送簡訊驗證碼
export const sendSmsVerification = async (phoneNumber, recipientName) => {
  try {
    // 檢查是否配置了 Twilio
    const client = createTwilioClient();
    const useTwilio = client && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER !== 'your-twilio-phone-number';
    
    const verificationCode = generateVerificationCode();
    
    if (useTwilio) {
      console.log('🔄 使用Twilio發送簡訊...');
      
      const message = await client.messages.create({
        body: `🏠 房屋群組邀請驗證碼：${verificationCode}
        
您好 ${recipientName}！您被邀請加入房屋管理群組。

請在應用程式中輸入此驗證碼來完成加入：
${verificationCode}

此驗證碼將在10分鐘後過期。
如果您沒有請求此驗證，請忽略此簡訊。

- Corent Manager`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      console.log('✅ 簡訊發送成功:', message.sid);
      return { 
        success: true, 
        messageId: message.sid, 
        verificationCode: verificationCode,
        provider: 'twilio' 
      };
      
    } else {
      // 模擬發送 (用於測試)
      console.log('⚠️  Twilio未配置，使用模擬簡訊服務');
      console.log(`📱 模擬簡訊發送到: ${phoneNumber}`);
      console.log(`👤 收件人: ${recipientName}`);
      console.log(`🔢 驗證碼: ${verificationCode}`);
      
      return { 
        success: true, 
        messageId: 'mock_' + Date.now(), 
        verificationCode: verificationCode,
        provider: 'mock',
        mockMessage: `簡訊已發送到 ${phoneNumber}，驗證碼：${verificationCode}`
      };
    }
    
  } catch (error) {
    console.error('❌ 簡訊發送失敗:', error);
    return { success: false, error: error.message };
  }
};

// 發送邀請簡訊 (包含邀請鏈接)
export const sendInvitationSms = async (phoneNumber, recipientName, inviteToken) => {
  try {
    const client = createTwilioClient();
    const useTwilio = client && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER !== 'your-twilio-phone-number';
    
    const inviteLink = `https://yourapp.com/invite?token=${inviteToken}`;
    
    if (useTwilio) {
      console.log('🔄 使用Twilio發送邀請簡訊...');
      
      const message = await client.messages.create({
        body: `🏠 房屋群組邀請
        
您好 ${recipientName}！您被邀請加入房屋管理群組。

點擊以下鏈接來加入：
${inviteLink}

通過這個群組，您可以：
✅ 管理房屋費用和付款
✅ 跟踪共同開支
✅ 與室友保持聯繫

此邀請將在7天後過期。

- Corent Manager`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      console.log('✅ 邀請簡訊發送成功:', message.sid);
      return { 
        success: true, 
        messageId: message.sid, 
        provider: 'twilio' 
      };
      
    } else {
      // 模擬發送
      console.log('⚠️  Twilio未配置，使用模擬簡訊服務');
      console.log(`📱 模擬邀請簡訊發送到: ${phoneNumber}`);
      console.log(`👤 收件人: ${recipientName}`);
      console.log(`🔗 邀請鏈接: ${inviteLink}`);
      
      return { 
        success: true, 
        messageId: 'mock_invite_' + Date.now(), 
        provider: 'mock',
        mockMessage: `邀請簡訊已發送到 ${phoneNumber}`
      };
    }
    
  } catch (error) {
    console.error('❌ 邀請簡訊發送失敗:', error);
    return { success: false, error: error.message };
  }
};

// 測試 Twilio 配置
export const testSmsConfig = async () => {
  try {
    const client = createTwilioClient();
    const useTwilio = client && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER !== 'your-twilio-phone-number';
    
    if (useTwilio) {
      // 測試 Twilio 連接
      const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log('✅ Twilio連接正常，賬戶狀態:', account.status);
      return true;
    } else {
      console.log('⚠️  Twilio未配置，將使用模擬簡訊服務');
      return true;
    }
  } catch (error) {
    console.error('❌ Twilio連接失敗:', error);
    return false;
  }
};
