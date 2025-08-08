// const groups = [];  臨時存儲，實際應用中應使用資料庫

import { PrismaClient } from '@prisma/client';
import { success } from 'zod';

const prisma = new PrismaClient();


const generateGroupCode = () => {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

// create group
 const createGroup = async (req, res) => {
  console.log('🚀 createGroup 函數被調用');
  console.log('用戶信息:', req.user);
  console.log('請求數據:', req.body);

  try {

    const userId = req.user.id; 
    const { name, description } = req.body;

    console.log(`用戶 ${userId} 嘗試創建群組: ${name}`);

    // 輸入驗證
    if (!name || !description) {
      return res.status(400).json({ // 修正語法錯誤
        message: "Both name and description are required"
      });
    }

    // check if group is exisited
    const existingGroup = await prisma.group.findFirst({ // 修正變數名和添加 const
      where: { name }
    });

    if (existingGroup) {
      return res.status(400).json({ // 添加 return
        message: "Group name already exist "
      });
    }

    

    // 使用事務創建群組和成員關係
    const result = await prisma.$transaction(async (tx) => {
      // 1. 創建群組
      const newGroup = await tx.group.create({ 
        data: {
          // 移除 id，讓它自動生成
          name,
          description,
          ownerId: userId
        }
      });

      console.log('✅ 群組創建成功:', newGroup);

      // 2. 自動將群組創建者添加為成員（管理員角色）
      const ownerMembership = await tx.member.create({
        data: {
          userId: userId,
          groupId: newGroup.id,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });

      console.log('✅ 擁有者成員關係創建成功:', ownerMembership);

      return newGroup;
    });

    console.log('✅ 群組創建完成');

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: {
        id: result.id,
        name: result.name,
        description: result.description, // 修正屬性名
        createdAt: result.createdAt
      }
    });

  } catch (error) {
    console.error('💥 創建群組時發生錯誤:', error);
    console.error('錯誤堆疊:', error.stack);
    
    res.status(500).json({
      success: false,
      message: "Failed to create group",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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

// 獲取群組成員資訊
const getUserGroupMember = async (req, res) => {

        console.log('=== getUserGroupMember 調試 ===');
    console.log('用戶信息:', req.user);
  try {
    const userId = req.user.id;

     console.log('用戶 ID:', userId);
     console.log('🔍 開始查詢用戶群組成員資訊...');

    const userMemberships = await prisma.member.findMany({
      where: { 
        userId: userId,
        status: 'ACTIVE'
      },
      include: {
        group: {
          include: {
            owner: {
              select: { id: true, name: true, email: true }
            },
            members: {  // ← 新增：包含所有成員資訊
              where: { status: 'ACTIVE' },
              include: {
                user: {  // ← 新增：包含每個成員的用戶資訊
                  select: { id: true, name: true, email: true }
                }
              },
              orderBy: { joinedAt: 'asc' }
            },
            _count: {
              select: { members: true }
            }
          }
        }
      }
    });

        console.log('✅ 查詢到的用戶群組數量:', userMemberships.length);
    console.log('✅ 用戶群組詳情:', JSON.stringify(userMemberships, null, 2));

    const groups = userMemberships.map(membership => ({
      id: membership.group.id,
      name: membership.group.name,
      description: membership.group.description,
      owner: membership.group.owner,
      memberCount: membership.group._count.members,
      userRole: membership.role, 
      joinedAt: membership.createdAt,
      // ← 新增：所有成員的詳細資訊
      members: membership.group.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
        status: member.status,
        joinedAt: member.createdAt,
        isCurrentUser: member.user.id === userId  // 標記是否為當前用戶
      }))
    }));

    // 返回資料
    res.json({
      success: true,
      groups: groups,  // ← 改為 groups 而不是 group
      totalCount: groups.length,
      userId: userId
    });

  } catch (error) {
    console.error("❌ 獲取群組成員資訊時發生錯誤:", error);
    console.error("❌ 錯誤堆疊:", error.stack);
    console.error("❌ 錯誤類型:", error.constructor.name);
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch group members info"
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
  getUserGroupMember,
  getGroupDetails,
};
