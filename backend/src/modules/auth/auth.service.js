const bcryptService = require('./password.service');
const tokenService = require('./token.service');
const repository = require('./auth.repository');

async function createUser({ firstName, lastName, email, password, role }) {
  const exists = await repository.getUserByEmail(email);
  if (exists) throw new Error('Email already in use');
  const hashed = await bcryptService.hashPassword(password);
  const user = await repository.createUser({ firstName, lastName, email, password: hashed, role: role || 'viewer' });
  return { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName };
}

async function authenticateUser({ email, password }) {
  const user = await repository.getUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcryptService.verifyPassword(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const accessToken = tokenService.generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = tokenService.generateRefreshToken({ userId: user.id, role: user.role });
  await repository.saveRefreshToken({ token: refreshToken, userId: user.id, expiresAt: tokenService.getRefreshExpiryDate() });
  return { user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, accessToken, refreshToken };
}

async function refreshAccessToken(refreshToken) {
  const payload = tokenService.verifyRefreshToken(refreshToken);
  const dbToken = await repository.getRefreshToken(refreshToken);
  if (!dbToken) throw new Error('Refresh token not found');
  const accessToken = tokenService.generateAccessToken({ userId: payload.userId, role: payload.role || 'viewer' });
  return { accessToken };
}

async function revokeRefreshToken(refreshToken) {
  await repository.deleteRefreshToken(refreshToken);
}

async function getUserById(id) {
  const user = await repository.getUserById(id);
  if (!user) throw new Error('User not found');
  return { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName };
}

module.exports = { createUser, authenticateUser, refreshAccessToken, revokeRefreshToken, getUserById };
