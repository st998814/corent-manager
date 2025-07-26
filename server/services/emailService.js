import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 创建测试邮件传输器（使用Ethereal Email）
const createTestTransporter = async () => {
  // 为测试创建一个临时账户
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// 创建Gmail传输器
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// 发送邀请邮件
export const sendInvitationEmail = async (recipientEmail, recipientName, inviteToken) => {
  try {
    // 检查是否配置了Gmail
    const useGmail = process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-16-digit-app-password';
    
    let transporter;
    if (useGmail) {
      transporter = createGmailTransporter();
      console.log('🔄 使用Gmail发送邮件...');
    } else {
      transporter = await createTestTransporter();
      console.log('🔄 使用测试邮件服务发送邮件...');
    }
    
    const inviteLink = `https://yourapp.com/invite?token=${inviteToken}`;
    
    const mailOptions = {
      from: useGmail ? process.env.EMAIL_USER : 'noreply@corent-manager.com',
      to: recipientEmail,
      subject: '🏠 房屋群組邀請',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏠 房屋群組邀請</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">您好，${recipientName}！</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              您被邀請加入一個房屋管理群組。通過這個群組，您可以：
            </p>
            
            <ul style="color: #666; font-size: 16px; line-height: 1.8;">
              <li>✅ 管理房屋費用和付款</li>
              <li>✅ 跟踪共同開支</li>
              <li>✅ 與室友保持聯繫</li>
              <li>✅ 分享房屋相關資訊</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" 
                 style="background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
                接受邀請
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              如果按钮无法点击，请复制以下链接到浏览器：<br>
              <a href="${inviteLink}" style="color: #4CAF50;">${inviteLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              此邀請將在7天後過期。如果您沒有請求此邀請，請忽略此郵件。
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    
    if (useGmail) {
      console.log('✅ Gmail邮件发送成功:', result.messageId);
      return { success: true, messageId: result.messageId, provider: 'gmail' };
    } else {
      const previewUrl = nodemailer.getTestMessageUrl(result);
      console.log('✅ 测试邮件发送成功');
      console.log('🔗 预览链接:', previewUrl);
      return { 
        success: true, 
        messageId: result.messageId, 
        provider: 'test',
        previewUrl: previewUrl
      };
    }
    
  } catch (error) {
    console.error('❌ 邮件发送失败:', error);
    return { success: false, error: error.message };
  }
};

// 测试邮件配置
export const testEmailConfig = async () => {
  try {
    const useGmail = process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-16-digit-app-password';
    
    if (useGmail) {
      const transporter = createGmailTransporter();
      await transporter.verify();
      console.log('✅ Gmail服务器连接正常');
    } else {
      console.log('⚠️  Gmail未配置，将使用测试邮件服务');
    }
    return true;
  } catch (error) {
    console.error('❌ 邮件服务器连接失败:', error);
    return false;
  }
};
