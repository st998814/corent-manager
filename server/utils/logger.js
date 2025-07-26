import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import appConfig from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 自定義格式
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// 控制台格式（開發環境使用）
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${message}`;
    
    // 如果有額外的元數據，添加到日誌中
    if (Object.keys(meta).length > 0) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return logMessage;
  })
);

// 創建日誌傳輸器
const transports = [];

// 控制台輸出（開發環境）
if (appConfig.isDevelopment) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: appConfig.logging.level
    })
  );
}

// 文件輸出（生產環境）
if (appConfig.isProduction) {
  // 錯誤日誌
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      format: customFormat,
      maxsize: appConfig.logging.fileMaxSize,
      maxFiles: appConfig.logging.maxFiles
    })
  );
  
  // 組合日誌
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      format: customFormat,
      maxsize: appConfig.logging.fileMaxSize,
      maxFiles: appConfig.logging.maxFiles
    })
  );
}

// 創建主要記錄器
const logger = winston.createLogger({
  level: appConfig.logging.level,
  format: customFormat,
  transports,
  // 處理未捕獲的異常
  exceptionHandlers: appConfig.isProduction ? [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log'),
      format: customFormat
    })
  ] : [],
  // 處理未處理的Promise拒絕
  rejectionHandlers: appConfig.isProduction ? [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/rejections.log'),
      format: customFormat
    })
  ] : [],
  // 設定exitOnError為false，避免錯誤
  exitOnError: false
});

// 創建專門的記錄器用於不同模組
export const authLogger = logger.child({ service: 'auth' });
export const smsLogger = logger.child({ service: 'sms' });
export const apiLogger = logger.child({ service: 'api' });
export const securityLogger = logger.child({ service: 'security' });

// 專門的安全事件記錄
export const logSecurityEvent = (event, details = {}) => {
  securityLogger.warn('SECURITY_EVENT', {
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// 專門的SMS事件記錄
export const logSmsEvent = (event, phone, details = {}) => {
  smsLogger.info('SMS_EVENT', {
    event,
    phone: phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'), // 模糊化電話號碼
    timestamp: new Date().toISOString(),
    ...details
  });
};

// 專門的認證事件記錄
export const logAuthEvent = (event, userId, details = {}) => {
  authLogger.info('AUTH_EVENT', {
    event,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// 專門的API請求記錄
export const logApiRequest = (req, res, responseTime) => {
  const { method, url, ip, headers } = req;
  
  apiLogger.info('API_REQUEST', {
    method,
    url,
    ip,
    userAgent: headers['user-agent'],
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    timestamp: new Date().toISOString()
  });
};

// 性能監控
export const logPerformance = (operation, duration, details = {}) => {
  logger.info('PERFORMANCE', {
    operation,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// 錯誤記錄幫助函數
export const logError = (error, context = {}) => {
  logger.error('APPLICATION_ERROR', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  });
};

// 確保日誌目錄存在
if (appConfig.isProduction) {
  import('fs').then(fs => {
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  });
}

export default logger;
