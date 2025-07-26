/**
 * Application Configuration Module for Corent Manager
 * 
 * This module handles the centralized configuration management for the entire application.
 * It provides type-safe environment variable validation and structured configuration access.
 * 
 * Key Features:
 * 
 * 1. Environment Variable Validation:
 *    - Uses Zod schema for strict type checking and validation
 *    - Provides default values for optional configurations
 *    - Transforms string values to appropriate types (numbers, booleans)
 *    - Validates required fields and format constraints
 * 
 * 2. Multi-Environment Support:
 *    - Development, Production, and Test environment configurations
 *    - Environment-specific validation rules
 *    - Production-specific required field validation
 * 
 * 3. Configuration Categories:
 *    - Application Settings (NODE_ENV, PORT, API_VERSION)
 *    - JWT Authentication (secrets, expiration times)
 *    - Security Settings (bcrypt rounds, rate limiting, login attempts)
 *    - SMS Integration (Twilio configuration for notifications)
 *    - Email Services (SMTP configuration for notifications)
 *    - Database Connections (PostgreSQL, Redis URLs)
 *    - Logging Configuration (levels, file rotation)
 * 
 * 4. Structured Export:
 *    - Groups related configurations into logical objects
 *    - Provides convenience properties (isProduction, isDevelopment)
 *    - Pre-validates service availability (SMS, database connections)
 * 
 * 5. Error Handling:
 *    - Comprehensive validation error reporting
 *    - Graceful degradation for optional services
 *    - Clear error messages for missing required configurations
 * 
 * Usage:
 * - Import this module to access validated configuration throughout the app
 * - All environment variables are type-safe and validated on startup
 * - Configuration errors will prevent application startup with clear messages
 * 
 * @author Corent Manager Team
 * @version 1.0.0
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// 載入環境變數
dotenv.config();

// 環境變數驗證 schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default(8080),
  API_VERSION: z.string().default('v1').transform(v => v.replace(/^\/|\/$/g, '')),
  
  // JWT配置
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('30d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // 安全配置
  BCRYPT_ROUNDS: z.string().transform(Number).default(12),
  MAX_LOGIN_ATTEMPTS: z.string().transform(Number).default(5),
  LOCKOUT_TIME: z.string().transform(Number).default(15), // 分鐘
  RATE_LIMIT_WINDOW: z.string().transform(Number).default(15), // 分鐘
  RATE_LIMIT_MAX: z.string().transform(Number).default(100),
  
  // SMS配置
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  SMS_RATE_LIMIT: z.string().transform(Number).default(3),
  SMS_COOLDOWN: z.string().transform(Number).default(60), // 秒
  VERIFICATION_CODE_EXPIRY: z.string().transform(Number).default(300), // 秒
  
  // Email配置
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_SERVICE: z.string().default('gmail'),
  
  // 數據庫配置
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  
  // 日誌配置
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_MAX_SIZE: z.string().default('10mb'),
  LOG_MAX_FILES: z.string().transform(Number).default(5)
});

// 驗證環境變數
let config;
try {
  config = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Environment validation failed:');
  if (error instanceof z.ZodError) {
    error.errors.forEach(err => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  }
  process.exit(1);
}

// 檢查生產環境必需的配置
if (config.NODE_ENV === 'production') {
  const requiredInProduction = [
    'DATABASE_URL',
    'REDIS_URL'
  ];
  
  const missing = requiredInProduction.filter(key => !config[key]);
  if (missing.length > 0) {
    console.error(`❌ Missing required production environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// 檢查Twilio配置
const hasTwilioConfig = config.TWILIO_ACCOUNT_SID && 
                       config.TWILIO_AUTH_TOKEN && 
                       config.TWILIO_PHONE_NUMBER;

if (!hasTwilioConfig && config.NODE_ENV === 'production') {
  console.warn('⚠️  Twilio configuration missing in production. SMS will use mock service.');
}

// 導出配置
export const appConfig = {
  ...config,
  
  // 便利屬性
  isProduction: config.NODE_ENV === 'production',
  isDevelopment: config.NODE_ENV === 'development',
  isTest: config.NODE_ENV === 'test',
  
  // SMS配置狀態
  sms: {
    enabled: hasTwilioConfig,
    accountSid: config.TWILIO_ACCOUNT_SID,
    authToken: config.TWILIO_AUTH_TOKEN,
    phoneNumber: config.TWILIO_PHONE_NUMBER,
    rateLimit: config.SMS_RATE_LIMIT,
    cooldown: config.SMS_COOLDOWN,
    verificationExpiry: config.VERIFICATION_CODE_EXPIRY
  },
  
  // 安全配置
  security: {
    bcryptRounds: config.BCRYPT_ROUNDS,
    maxLoginAttempts: config.MAX_LOGIN_ATTEMPTS,
    lockoutTime: config.LOCKOUT_TIME,
    rateLimit: {
      window: config.RATE_LIMIT_WINDOW,
      max: config.RATE_LIMIT_MAX
    }
  },
  
  // JWT配置
  jwt: {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRES_IN,
    refreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN
  },
  
  // 日誌配置
  logging: {
    level: config.LOG_LEVEL,
    fileMaxSize: config.LOG_FILE_MAX_SIZE,
    maxFiles: config.LOG_MAX_FILES
  }
};

// 在開發環境中顯示配置摘要
if (config.isDevelopment) {
  console.log('📋 Application Configuration:');
  console.log(`  - Environment: ${config.NODE_ENV}`);
  console.log(`  - Port: ${config.PORT}`);
  console.log(`  - SMS Enabled: ${appConfig.sms.enabled}`);
  console.log(`  - Log Level: ${config.LOG_LEVEL}`);
}



export default appConfig;
