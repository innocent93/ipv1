const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

exports.authenticate = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header first (API clients)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Then check HTTP-only cookie (browser sessions)
    else if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
    }

    try {
      const decoded = authService.verifyAccessToken(token);
      req.user = { id: decoded.id };
      next();
    } catch (jwtError) {
      // Token expired or invalid
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired — please refresh', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ success: false, message: 'Not authorized — invalid token' });
    }
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await authService.getMe(req.user.id);
      if (!roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: 'Not authorized for this action' });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ success: false, message: 'Not authorized' });
    }
  };
};
