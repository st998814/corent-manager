

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import appConfig from './config/index.js';
import { generalRateLimit } from './middleware/rateLimiterSimple.js';
import { validateContentType, validateSecurityHeaders } from './middleware/validation.js';
import logger, { logApiRequest, logError } from './utils/logger.js';

// 路由導入
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

// 安全中間件
app.use(helmet({
  contentSecurityPolicy: appConfig.isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// 壓縮中間件
app.use(compression());

// CORS配置
const corsOptions = {
  origin: appConfig.isProduction ? 
    process.env.ALLOWED_ORIGINS?.split(',') || 'https://yourdomain.com' :
    '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 請求解析中間件
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // 驗證JSON格式以防止解析攻擊
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        error: 'Invalid JSON',
        message: '請求數據格式錯誤'
      });
      return;
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 信任代理（生產環境中很重要）
if (appConfig.isProduction) {
  app.set('trust proxy', 1);
}

// 安全驗證中間件
app.use(validateSecurityHeaders);
app.use(validateContentType());

// 通用速率限制
app.use(generalRateLimit);

// 請求日誌中間件
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logApiRequest(req, res, responseTime);
  });
  
  next();
});

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: appConfig.NODE_ENV,
    uptime: Math.floor(process.uptime())
  });
});

// API路由
const apiVersion = appConfig.API_VERSION;
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/auth`, profileRoutes);
app.use(`/api/${apiVersion}/users`, userRoutes);
app.use(`/api/${apiVersion}/members`, memberRoutes);
app.use(`/api/${apiVersion}/groups`, groupRoutes);

// 兼容舊版API路由
app.use('/api/auth', authRoutes);
app.use('/api/auth', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/groups', groupRoutes);

// 根路徑
app.get('/', (req, res) => {
  res.json({
    name: 'Corent Manager API',
    version: process.env.npm_package_version || '1.0.0',
    environment: appConfig.NODE_ENV,
    status: 'running',
    documentation: '/api/docs',
    health_check: '/health'
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: '請求的資源不存在',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// 全局錯誤處理中間件
app.use((error, req, res, next) => {
  // 記錄錯誤
  logError(error, {
    context: 'GLOBAL_ERROR_HANDLER',
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // 開發環境返回完整錯誤信息
  if (appConfig.isDevelopment) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
  
  // 生產環境返回通用錯誤信息
  res.status(500).json({
    error: 'Internal Server Error',
    message: '服務器內部錯誤，請稍後重試',
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  });
});

// 優雅關機處理
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  // 停止接受新請求
  const server = app.listen();
  server.close(() => {
    logger.info('HTTP server closed.');
    
    // 清理資源
    // 例如關閉數據庫連接、清理緩存等
    
    logger.info('Graceful shutdown completed.');
    process.exit(0);
  });
  
  // 強制退出超時
  setTimeout(() => {
    logger.error('Graceful shutdown timeout. Forcing exit.');
    process.exit(1);
  }, 10000);
};

// 註冊優雅關機信號
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 未捕獲異常處理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;