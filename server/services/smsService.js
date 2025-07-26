/**
 * SMS Service Module for Corent Manager
 * 
 * This service handles SMS functionality for the house management application.
 * It provides two main services:
 * 
 * 1. SMS Verification Codes:
 *    - Generates and sends 6-digit verification codes to users
 *    - Used for phone number verification during registration/login
 *    - Codes expire after 10 minutes for security
 * 
 * 2. Group Invitation SMS:
 *    - Sends invitation messages with links to join house management groups
 *    - Includes information about group features (expense tracking, payments, etc.)
 *    - Invitations expire after 7 days
 * 
 * Features:
 * - Dual Mode Operation: Uses Twilio for production, mock service for development
 * - Auto-detection: Automatically switches between real/mock based on configuration
 * - Error Handling: Comprehensive error handling and logging
 * - Testing Support: Includes configuration testing utilities
 * 
 * Configuration:
 * - Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env
 * - Falls back to mock service if Twilio credentials are not configured
 * 
 * @author Corent Manager Team
 * @version 1.0.0
 */

// Import Twilio SDK for SMS functionality
import twilio from 'twilio';
// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load environment variables into process.env
dotenv.config();

// Lazy initialization function for Twilio client to avoid errors if credentials are missing
const createTwilioClient = () => {
  // Check if required environment variables are set and not default placeholder values
  if (!process.env.TWILIO_ACCOUNT_SID || 
      !process.env.TWILIO_AUTH_TOKEN || 
      process.env.TWILIO_ACCOUNT_SID === 'your-twilio-account-sid') {
    // Return null if Twilio is not properly configured
    return null;
  }
  // Create and return Twilio client with credentials from environment variables
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  // Generate random number between 100000-999999 and convert to string
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Main function to send SMS verification codes to users
export const sendSmsVerification = async (phoneNumber, recipientName) => {
  try {
    // Create Twilio client instance (may be null if not configured)
    const client = createTwilioClient();
    // Check if Twilio is fully configured with valid phone number
    const useTwilio = client && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER !== 'your-twilio-phone-number';
    
    // Generate a new verification code for this request
    const verificationCode = generateVerificationCode();
    
    // If Twilio is properly configured, use real SMS service
    if (useTwilio) {
      // Log that we're using Twilio for SMS sending
      console.log('🔄 使用Twilio發送簡訊...');
      
      // Create SMS message using Twilio API
      const message = await client.messages.create({
        // SMS body content with verification code and instructions
        body: `🏠 房屋群組邀請驗證碼：${verificationCode}
        
您好 ${recipientName}！您被邀請加入房屋管理群組。

請在應用程式中輸入此驗證碼來完成加入：
${verificationCode}

此驗證碼將在10分鐘後過期。
如果您沒有請求此驗證，請忽略此簡訊。

- Corent Manager`,
        // Sender phone number from environment variables
        from: process.env.TWILIO_PHONE_NUMBER,
        // Recipient phone number passed as parameter
        to: phoneNumber
      });

      // Log successful SMS sending with message ID
      console.log('✅ 簡訊發送成功:', message.sid);
      // Return success response with Twilio message details
      return { 
        success: true, 
        messageId: message.sid, 
        verificationCode: verificationCode,
        provider: 'twilio' 
      };
      
    } else {
      // If Twilio not configured, use mock SMS service for development/testing
      console.log('⚠️  Twilio未配置，使用模擬簡訊服務');
      // Log mock SMS details to console for debugging
      console.log(`📱 模擬簡訊發送到: ${phoneNumber}`);
      console.log(`👤 收件人: ${recipientName}`);
      console.log(`🔢 驗證碼: ${verificationCode}`);
      
      // Return mock success response for development
      return { 
        success: true, 
        messageId: 'mock_' + Date.now(), // Generate fake message ID
        verificationCode: verificationCode,
        provider: 'mock',
        mockMessage: `簡訊已發送到 ${phoneNumber}，驗證碼：${verificationCode}`
      };
    }
    
  } catch (error) {
    // Log any errors that occur during SMS sending
    console.error('❌ 簡訊發送失敗:', error);
    // Return error response with error message
    return { success: false, error: error.message };
  }
};

// Function to send invitation SMS with group join links
export const sendInvitationSms = async (phoneNumber, recipientName, inviteToken) => {
  try {
    // Create Twilio client instance
    const client = createTwilioClient();
    // Check if Twilio is properly configured
    const useTwilio = client && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER !== 'your-twilio-phone-number';
    
    // Generate invitation link with the provided token
    const inviteLink = `https://yourapp.com/invite?token=${inviteToken}`;
    
    // If Twilio is configured, send real invitation SMS
    if (useTwilio) {
      // Log that we're using Twilio for invitation SMS
      console.log('🔄 使用Twilio發送邀請簡訊...');
      
      // Create invitation SMS message
      const message = await client.messages.create({
        // SMS body with invitation details and app features
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
        // Sender phone number from environment
        from: process.env.TWILIO_PHONE_NUMBER,
        // Recipient phone number
        to: phoneNumber
      });

      // Log successful invitation SMS sending
      console.log('✅ 邀請簡訊發送成功:', message.sid);
      // Return success response with message details
      return { 
        success: true, 
        messageId: message.sid, 
        provider: 'twilio' 
      };
      
    } else {
      // If Twilio not configured, use mock service for development
      console.log('⚠️  Twilio未配置，使用模擬簡訊服務');
      // Log mock invitation SMS details
      console.log(`📱 模擬邀請簡訊發送到: ${phoneNumber}`);
      console.log(`👤 收件人: ${recipientName}`);
      console.log(`🔗 邀請鏈接: ${inviteLink}`);
      
      // Return mock success response
      return { 
        success: true, 
        messageId: 'mock_invite_' + Date.now(), // Generate fake message ID
        provider: 'mock',
        mockMessage: `邀請簡訊已發送到 ${phoneNumber}`
      };
    }
    
  } catch (error) {
    // Log any errors during invitation SMS sending
    console.error('❌ 邀請簡訊發送失敗:', error);
    // Return error response
    return { success: false, error: error.message };
  }
};

// Function to test if Twilio configuration is working properly
export const testSmsConfig = async () => {
  try {
    // Create Twilio client instance
    const client = createTwilioClient();
    // Check if Twilio is properly configured with valid credentials
    const useTwilio = client && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER !== 'your-twilio-phone-number';
    
    // If Twilio is configured, test the connection
    if (useTwilio) {
      // Fetch account information from Twilio API to verify connection
      const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      // Log successful connection with account status
      console.log('✅ Twilio連接正常，賬戶狀態:', account.status);
      // Return true indicating successful configuration
      return true;
    } else {
      // If Twilio not configured, log that mock service will be used
      console.log('⚠️  Twilio未配置，將使用模擬簡訊服務');
      // Return true as mock service is always available
      return true;
    }
  } catch (error) {
    // Log any connection errors
    console.error('❌ Twilio連接失敗:', error);
    // Return false indicating configuration failure
    return false;
  }
};
