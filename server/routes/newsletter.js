const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers, exportSubscribers } = require('../controllers/newsletterController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { honeypot } = require('../middleware/rateLimiter');

router.post('/', honeypot('website'), validate(schemas.newsletter), subscribe);
router.get('/', authenticate, authorize('admin', 'editor'), getSubscribers);
router.get('/export', authenticate, authorize('admin'), exportSubscribers);

module.exports = router;
