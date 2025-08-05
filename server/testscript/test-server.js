import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

// 基本中間件
app.use(cors());
app.use(express.json());

// 健康檢查端點
app.get('/api/health', (req, res) => {
  console.log('🏥 健康檢查請求');
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 測試認證端點
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 登入請求:', req.body);
  res.json({
    success: true,
    message: 'Test login successful',
    user: { id: 1, username: 'testuser' },
    token: 'test-token-123'
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('📝 註冊請求:', req.body);
  res.json({
    success: true,
    message: 'Test registration successful',
    user: { id: 2, username: req.body.name }
  });
});

app.get('/api/auth/me', (req, res) => {
  console.log('👤 用戶資料請求');
  res.json({
    success: true,
    user: { id: 1, name: 'Test User', username: 'testuser' }
  });
});

app.post('/api/groups/groupinfo', (req, res) => {
  console.log('🏘️ 群組資訊請求');
  res.json({
    success: true,
    groups: [
      {
        id: 1,
        name: 'Test Group',
        description: 'Test group for development',
        memberCount: 2,
        userRole: 'member',
        members: [
          { id: 1, name: 'Test User', email: 'test@example.com', role: 'member', isCurrentUser: true },
          { id: 2, name: 'Other User', email: 'other@example.com', role: 'member', isCurrentUser: false }
        ]
      }
    ]
  });
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('❌ 伺服器錯誤:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 處理
app.use('*', (req, res) => {
  console.log('❓ 找不到路由:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 測試伺服器啟動成功！`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌐 http://192.168.20.17:${PORT}`);
  console.log(`🏥 健康檢查: http://192.168.20.17:${PORT}/api/health`);
});
