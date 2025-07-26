import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testExistingUsers() {
  try {
    // 獲取所有用戶
    const users = await prisma.user.findMany();
    
    console.log('📋 資料庫中的用戶:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
      console.log(`  Password Hash: ${user.password.substring(0, 20)}...`);
    });

    // 測試常見密碼
    const testPasswords = ['123456', 'password', 'test', 'admin', '1234'];
    
    for (const user of users) {
      console.log(`\n🔍 測試用戶: ${user.email}`);
      
      for (const testPassword of testPasswords) {
        try {
          const isMatch = await bcrypt.compare(testPassword, user.password);
          if (isMatch) {
            console.log(`✅ 找到密碼: ${testPassword}`);
            break;
          }
        } catch (error) {
          console.log(`❌ 測試密碼 ${testPassword} 時出錯:`, error.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ 錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testExistingUsers();
