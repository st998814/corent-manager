
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


prisma.$connect()
  .then(() => console.log('✅ 數據庫連接成功'))
  .catch((error) => console.error('❌ 數據庫連接失敗:', error));