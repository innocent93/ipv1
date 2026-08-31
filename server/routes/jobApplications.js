const express = require('express');
const router = express.Router();
const { submitApplication, trackApplication, getApplications, updateStatus } = require('../controllers/jobApplicationController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.post('/apply', validate(schemas.jobApplication), submitApplication);
router.post('/track', validate(schemas.trackApplication), trackApplication);
router.get('/', authenticate, authorize('admin', 'editor'), getApplications);
router.put('/:id/status', authenticate, authorize('admin', 'editor'), validate(schemas.updateApplicationStatus), updateStatus);

module.exports = router;
