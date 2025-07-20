import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


// compile to : INSERT INTO "User" ("name", "email", "password") VALUES (...)
export const createUser = (data) => prisma.user.create({ data });


// compile to : SELECT * FROM "User" WHERE "email" = 'xxx'
// 'user' here is the table name
export const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

// function to list all users
// compile to : SELECT * FROM "User"
export const getAllUsers = () => prisma.user.findMany();