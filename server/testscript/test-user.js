import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testUser() {
  try {
    // 檢查所有用戶
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    console.log('數據庫中的用戶:', users);
    
    // 測試 JWT token 解析
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6InRlc3QiLCJpYXQiOjE3NTM3ODY2OTAsImV4cCI6MTc1NjM3ODY5MH0.4paxE2X90LYHnyK-rSQUZKdZm_JZqzKY37DJsKGSkts'; // 替換為你的實際 token
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
    console.log('Token 解析結果:', decoded);
    
  } catch (error) {
    console.error('測試失敗:', error);
  }
}

testUser();