import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {


    console.log('=== AUTH MIDDLEWARE 調試 ===');
    console.log('請求方法:', req.method);
    console.log('請求路徑:', req.path);
    console.log('所有請求頭:', req.headers);
    console.log('Authorization 頭:', req.headers.authorization);
    console.log('============================');
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        message: 'missing token'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'format of token is incorrect'
      });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前綴

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 將解碼的用戶信息添加到請求對象
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('❌ JWT驗證失敗:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: '認證令牌已過期'
      });
    }
    
    return res.status(401).json({
      message: '無效的認證令牌'
    });
  }
};
