import jwt from 'jsonwebtoken';

// 模擬用戶數據庫（實際應用中使用真實數據庫）
const users = new Map();

export const setupProfile = async (req, res) => {
  try {
    const { phone, name, email, inviteToken } = req.body;

    // 驗證必填字段
    if (!phone || !name || !email) {
      return res.status(400).json({
        message: '手機號碼、姓名和email都是必填字段'
      });
    }

    // 驗證email格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: '請輸入有效的email格式'
      });
    }

    // 驗證手機號碼格式
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: '請輸入有效的手機號碼格式'
      });
    }

    // 檢查email是否已經被使用
    for (const [userId, userData] of users.entries()) {
      if (userData.email === email && userData.phone !== phone) {
        return res.status(400).json({
          message: '此email已被其他用戶使用'
        });
      }
    }

    // 如果有邀請令牌，驗證它
    let groupInfo = null;
    if (inviteToken) {
      try {
        const decoded = jwt.verify(inviteToken, process.env.JWT_SECRET);
        console.log('🎫 邀請令牌驗證成功:', decoded);
        
        // 這裡可以根據邀請令牌獲取群組信息
        groupInfo = {
          groupId: 'default-group',
          invitedBy: decoded.invitedBy || 'system'
        };
      } catch (error) {
        console.log('⚠️ 邀請令牌驗證失敗:', error.message);
        // 邀請令牌無效，但仍然允許用戶設置個人資料
      }
    }

    // 生成用戶ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 創建用戶資料
    const userData = {
      id: userId,
      phone,
      name,
      email,
      createdAt: new Date().toISOString(),
      groupInfo
    };

    // 保存用戶資料
    users.set(userId, userData);

    // 生成新的JWT令牌
    const token = jwt.sign(
      {
        id: userId,
        phone,
        email,
        name
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('✅ 用戶個人資料設置成功:', {
      userId,
      phone,
      name,
      email,
      hasGroup: Boolean(groupInfo)
    });

    res.json({
      message: '個人資料設置成功',
      user: {
        id: userId,
        phone,
        name,
        email,
        groupInfo
      },
      token
    });

  } catch (error) {
    console.error('❌ 設置個人資料錯誤:', error);
    res.status(500).json({
      message: '服務器錯誤，請稍後重試'
    });
  }
};

// 獲取用戶資料
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = users.get(userId);

    if (!userData) {
      return res.status(404).json({
        message: '用戶不存在'
      });
    }

    res.json({
      user: {
        id: userData.id,
        phone: userData.phone,
        name: userData.name,
        email: userData.email,
        groupInfo: userData.groupInfo,
        createdAt: userData.createdAt
      }
    });

  } catch (error) {
    console.error('❌ 獲取用戶資料錯誤:', error);
    res.status(500).json({
      message: '服務器錯誤，請稍後重試'
    });
  }
};

// 更新用戶資料
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const userData = users.get(userId);
    if (!userData) {
      return res.status(404).json({
        message: '用戶不存在'
      });
    }

    // 驗證email格式
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: '請輸入有效的email格式'
        });
      }

      // 檢查email是否已被其他用戶使用
      for (const [otherUserId, otherUserData] of users.entries()) {
        if (otherUserId !== userId && otherUserData.email === email) {
          return res.status(400).json({
            message: '此email已被其他用戶使用'
          });
        }
      }
    }

    // 更新用戶資料
    const updatedUserData = {
      ...userData,
      ...(name && { name }),
      ...(email && { email }),
      updatedAt: new Date().toISOString()
    };

    users.set(userId, updatedUserData);

    console.log('✅ 用戶資料更新成功:', {
      userId,
      name: updatedUserData.name,
      email: updatedUserData.email
    });

    res.json({
      message: '個人資料更新成功',
      user: {
        id: updatedUserData.id,
        phone: updatedUserData.phone,
        name: updatedUserData.name,
        email: updatedUserData.email,
        groupInfo: updatedUserData.groupInfo
      }
    });

  } catch (error) {
    console.error('❌ 更新用戶資料錯誤:', error);
    res.status(500).json({
      message: '服務器錯誤，請稍後重試'
    });
  }
};
