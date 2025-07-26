
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// 模擬用戶數據庫（實際應用中使用真實數據庫）
const users = new Map();

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 驗證必填字段
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Name, email and password are required' 
      });
    }

    // 檢查用戶是否已存在
    const existingUser = Array.from(users.values()).find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建新用戶
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.set(userId, newUser);

    // 生成 JWT token
    const token = jwt.sign(
      { id: userId, email, name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('✅ 用戶註冊成功:', { userId, email, name });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        name,
        email
      },
      token
    });

  } catch (error) {
    console.error('❌ 註冊錯誤:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 驗證輸入
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // 查找用戶
    const user = Array.from(users.values()).find(user => user.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('✅ 用戶登錄成功:', { userId: user.id, email });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ 登錄錯誤:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ 獲取用戶資料錯誤:', error);
    res.status(500).json({ message: 'Server error getting user profile' });
  }
};


