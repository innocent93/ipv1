const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { setAuthCookie, clearAuthCookie } = require('../utils/authCookies');
const emailService = require('./emailService');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Generate cryptographically secure random token
const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');

// Create access token (short-lived)
const createAccessToken = (userId) => {
  return jwt.sign({ id: userId, type: 'access' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Create refresh token (long-lived, stored in DB)
const createRefreshTokenDoc = async (userId, ipAddress, userAgent) => {
  const token = generateRefreshToken();
  const expiresInMs = parseDuration(JWT_REFRESH_EXPIRES_IN);

  const refreshDoc = await RefreshToken.create({
    token,
    user: userId,
    expiresAt: new Date(Date.now() + expiresInMs),
    ipAddress,
    userAgent,
  });

  return token;
};

// Parse duration string like '7d', '15m', '24h' to milliseconds
function parseDuration(str) {
  const match = str.match(/^(\d+)([dhm])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  const [, num, unit] = match;
  const multipliers = { d: 24 * 60 * 60 * 1000, h: 60 * 60 * 1000, m: 60 * 1000 };
  return parseInt(num) * multipliers[unit];
}

// Rotate refresh token (security best practice: one-time use)
const rotateRefreshToken = async (oldToken, ipAddress, userAgent) => {
  const tokenDoc = await RefreshToken.findOne({ token: oldToken });

  if (!tokenDoc || tokenDoc.isExpired() || tokenDoc.isRevoked()) {
    // Potential token reuse detected — revoke the entire family
    if (tokenDoc && !tokenDoc.isRevoked()) {
      await RefreshToken.updateMany(
        { user: tokenDoc.user, revokedAt: { $exists: false } },
        { revokedAt: new Date() }
      );
      logger.warn('Refresh token reuse detected — revoked all user tokens', { userId: tokenDoc.user });
    }
    throw new Error('Invalid or expired refresh token');
  }

  // Mark old token as replaced
  const newToken = generateRefreshToken();
  const expiresInMs = parseDuration(JWT_REFRESH_EXPIRES_IN);

  tokenDoc.replacedByToken = newToken;
  tokenDoc.revokedAt = new Date();
  await tokenDoc.save();

  const newDoc = await RefreshToken.create({
    token: newToken,
    user: tokenDoc.user,
    expiresAt: new Date(Date.now() + expiresInMs),
    ipAddress,
    userAgent,
  });

  return { newToken, userId: tokenDoc.user };
};

exports.register = async (userData) => {
  const { email, password, name, role = 'editor' } = userData;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error('Email already registered');

  const user = await User.create({ email: email.toLowerCase(), password, name, role });
  logger.info('User registered', { userId: user._id, email: user.email });

  return { id: user._id, email: user.email, name: user.name, role: user.role };
};

exports.login = async (email, password, ipAddress, userAgent) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  // Revoke all existing refresh tokens for this user (optional: keep multiple sessions)
  await RefreshToken.updateMany(
    { user: user._id, revokedAt: { $exists: false } },
    { revokedAt: new Date() }
  );

  const accessToken = createAccessToken(user._id);
  const refreshToken = await createRefreshTokenDoc(user._id, ipAddress, userAgent);

  logger.info('User logged in', { userId: user._id, email: user.email });

  return {
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
};

exports.refreshAccessToken = async (refreshToken, ipAddress, userAgent) => {
  if (!refreshToken) throw new Error('Refresh token required');

  const { newToken, userId } = await rotateRefreshToken(refreshToken, ipAddress, userAgent);
  const accessToken = createAccessToken(userId);

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  logger.info('Access token refreshed', { userId: user._id });

  return {
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken: newToken,
  };
};

exports.logout = async (refreshToken, res) => {
  if (refreshToken) {
    const doc = await RefreshToken.findOne({ token: refreshToken });
    if (doc) {
      doc.revokedAt = new Date();
      await doc.save();
    }
  }

  // Also clear any auth cookie if present
  if (res && clearAuthCookie) {
    clearAuthCookie(res);
  }

  logger.info('User logged out');
  return { success: true };
};

exports.logoutAll = async (userId) => {
  const result = await RefreshToken.updateMany(
    { user: userId, revokedAt: { $exists: false } },
    { revokedAt: new Date() }
  );

  logger.info('All sessions revoked for user', { userId, count: result.modifiedCount });
  return { success: true, revokedCount: result.modifiedCount };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Don't reveal whether email exists
    logger.info('Password reset requested for non-existent email', { email });
    return { message: 'If an account exists, a reset link has been sent' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.ADMIN_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  try {
    await emailService.sendPasswordReset(user.email, resetUrl, user.name);
    logger.info('Password reset email sent', { userId: user._id });
  } catch (err) {
    logger.error('Failed to send password reset email', { error: err.message, userId: user._id });
    // Still return success to prevent email enumeration
  }

  return { message: 'If an account exists, a reset link has been sent' };
};

exports.resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error('Invalid or expired reset token');

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Revoke all refresh tokens after password change
  await RefreshToken.updateMany(
    { user: user._id, revokedAt: { $exists: false } },
    { revokedAt: new Date() }
  );

  logger.info('Password reset successful', { userId: user._id });
  return { message: 'Password updated successfully. Please log in again.' };
};

// Verify access token (used by middleware)
exports.verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Get active sessions for a user
exports.getActiveSessions = async (userId) => {
  const sessions = await RefreshToken.find({
    user: userId,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 }).select('ipAddress userAgent createdAt expiresAt');

  return sessions;
};
