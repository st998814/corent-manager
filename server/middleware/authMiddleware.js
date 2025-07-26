import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        message: '缺少認證令牌'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: '認證令牌格式錯誤'
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
