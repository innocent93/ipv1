const authService = require('../services/authService');
const { setAuthCookie, setCSRFCookie, clearAuthCookie } = require('../utils/authCookies');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(req.body.email, req.body.password, ipAddress, userAgent);

    // Set HTTP-only auth cookie for browser sessions
    setAuthCookie(res, result.accessToken);
    setCSRFCookie(res);

    // Also return tokens in body for API clients
    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await authService.refreshAccessToken(refreshToken, ipAddress, userAgent);

    setAuthCookie(res, result.accessToken);

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken, res);
    clearAuthCookie(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    await authService.logoutAll(req.user.id);
    clearAuthCookie(res);
    res.status(200).json({ success: true, message: 'All sessions logged out' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body.token, req.body.password);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await authService.getActiveSessions(req.user.id);
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
