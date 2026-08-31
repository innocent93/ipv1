const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus, exportContacts } = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { honeypot } = require('../middleware/rateLimiter');

router.post('/', honeypot('website'), validate(schemas.contact), submitContact);
router.get('/', authenticate, authorize('admin', 'editor'), getContacts);
router.put('/:id/status', authenticate, authorize('admin', 'editor'), updateContactStatus);
router.get('/export', authenticate, authorize('admin'), exportContacts);

module.exports = router;
