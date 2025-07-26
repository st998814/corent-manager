const groups = []; // 臨時存儲，實際應用中應使用資料庫

// 生成 6 位數隨機驗證碼
const generateGroupCode = () => {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

// 創建群組
const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const groupCode = generateGroupCode();
    
    const newGroup = {
      id: Date.now().toString(),
      name,
      description,
      code: groupCode,
      createdBy: userId,
      members: [
        {
          userId,
          role: 'admin',
          joinedAt: new Date(),
        }
      ],
      createdAt: new Date(),
    };

    groups.push(newGroup);

    res.status(201).json({
      success: true,
      message: '群組創建成功',
      group: {
        id: newGroup.id,
        name: newGroup.name,
        description: newGroup.description,
        code: newGroup.code,
        memberCount: newGroup.members.length,
      }
    });
  } catch (error) {
    console.error('創建群組錯誤:', error);
    res.status(500).json({
      success: false,
      message: '創建群組時發生錯誤'
    });
  }
};

// 驗證群組代碼
const verifyGroupCode = async (req, res) => {
  try {
    const { code } = req.params;

    const group = groups.find(g => g.code === code.toUpperCase());
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: '無效的群組驗證碼'
      });
    }

    res.json({
      success: true,
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
      }
    });
  } catch (error) {
    console.error('驗證群組代碼錯誤:', error);
    res.status(500).json({
      success: false,
      message: '驗證群組代碼時發生錯誤'
    });
  }
};

// 加入群組
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { code } = req.body;
    const userId = req.user.id;

    const group = groups.find(g => g.id === groupId && g.code === code.toUpperCase());
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: '群組不存在或驗證碼錯誤'
      });
    }

    // 檢查用戶是否已經在群組中
    const isAlreadyMember = group.members.some(member => member.userId === userId);
    
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: '您已經是該群組的成員'
      });
    }

    // 添加用戶到群組
    group.members.push({
      userId,
      role: 'member',
      joinedAt: new Date(),
    });

    res.json({
      success: true,
      message: '已成功加入群組',
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
      }
    });
  } catch (error) {
    console.error('加入群組錯誤:', error);
    res.status(500).json({
      success: false,
      message: '加入群組時發生錯誤'
    });
  }
};

// 獲取用戶的群組列表
const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const userGroups = groups.filter(group => 
      group.members.some(member => member.userId === userId)
    ).map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      memberCount: group.members.length,
      role: group.members.find(member => member.userId === userId).role,
      createdAt: group.createdAt,
    }));

    res.json({
      success: true,
      groups: userGroups
    });
  } catch (error) {
    console.error('獲取群組列表錯誤:', error);
    res.status(500).json({
      success: false,
      message: '獲取群組列表時發生錯誤'
    });
  }
};

// 獲取群組詳情
const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = groups.find(g => g.id === groupId);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: '群組不存在'
      });
    }

    // 檢查用戶是否是群組成員
    const userMembership = group.members.find(member => member.userId === userId);
    
    if (!userMembership) {
      return res.status(403).json({
        success: false,
        message: '您不是該群組的成員'
      });
    }

    res.json({
      success: true,
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
        code: userMembership.role === 'admin' ? group.code : undefined,
        memberCount: group.members.length,
        members: group.members.map(member => ({
          userId: member.userId,
          role: member.role,
          joinedAt: member.joinedAt,
        })),
        createdAt: group.createdAt,
        userRole: userMembership.role,
      }
    });
  } catch (error) {
    console.error('獲取群組詳情錯誤:', error);
    res.status(500).json({
      success: false,
      message: '獲取群組詳情時發生錯誤'
    });
  }
};

export {
  createGroup,
  verifyGroupCode,
  joinGroup,
  getUserGroups,
  getGroupDetails,
};
