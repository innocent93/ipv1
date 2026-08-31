const express = require('express');
const router = express.Router();
const { createRSVP, getRSVPsByEvent, updateRSVPStatus, cancelRSVP } = require('../controllers/eventRSVPController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.post('/', validate(schemas.eventRSVP), createRSVP);
router.get('/event/:eventId', authenticate, authorize('admin', 'editor'), getRSVPsByEvent);
router.put('/:id/status', authenticate, authorize('admin', 'editor'), updateRSVPStatus);
router.post('/:id/cancel', cancelRSVP);

module.exports = router;
