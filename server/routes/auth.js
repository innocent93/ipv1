const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, logoutAll, me, forgotPassword, resetPassword, getSessions } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/me', authenticate, me);
router.get('/sessions', authenticate, getSessions);
router.post('/forgot-password', validate(schemas.forgotPassword), forgotPassword);
router.post('/reset-password', validate(schemas.resetPassword), resetPassword);

module.exports = router;
