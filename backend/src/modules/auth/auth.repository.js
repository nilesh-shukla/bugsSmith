const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function createUser({ name, email, password, role }) {
  return prisma.user.create({ data: { name, email, password, role } });
}

async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function saveRefreshToken({ token, userId, expiresAt }) {
  return prisma.refreshToken.create({ data: { token, userId, expiresAt } });
}

async function getRefreshToken(token) {
  return prisma.refreshToken.findUnique({ where: { token } });
}

async function deleteRefreshToken(token) {
  return prisma.refreshToken.deleteMany({ where: { token } });
}

module.exports = { getUserByEmail, createUser, getUserById, saveRefreshToken, getRefreshToken, deleteRefreshToken };
