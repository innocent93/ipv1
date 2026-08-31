const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
};

exports.validate = (validations) => {
  return [...validations, handleValidationErrors];
};

exports.schemas = {
  // Auth
  register: [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain a number'),
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  forgotPassword: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  ],
  resetPassword: [
    body('token').notEmpty().withMessage('Reset token required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],

  // Contact
  contact: [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('phone').optional().trim().isLength({ max: 20 }).withMessage('Phone too long'),
    body('company').optional().trim().isLength({ max: 100 }),
    body('subject').optional().trim().isLength({ max: 200 }),
    body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
    body('serviceInterest').optional().trim(),
    body('website').optional().trim(), // Honeypot field
  ],

  // Newsletter
  newsletter: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('website').optional().trim(), // Honeypot
  ],

  // Blog
  blogPost: [
    body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    body('slug').trim().matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase alphanumeric with hyphens'),
    body('excerpt').trim().isLength({ min: 10, max: 500 }),
    body('content').trim().isLength({ min: 50 }),
    body('category').trim().notEmpty(),
    body('author').trim().notEmpty(),
  ],

  // Service
  service: [
    body('title').trim().isLength({ min: 3, max: 100 }),
    body('slug').trim().matches(/^[a-z0-9-]+$/),
    body('shortDescription').trim().isLength({ min: 10, max: 200 }),
    body('fullDescription').trim().isLength({ min: 50 }),
    body('category').isIn(['project-management', 'financial', 'environmental', 'esg', 'assurance', 'fraud']),
  ],

  // Team
  teamMember: [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('role').trim().isLength({ min: 2, max: 100 }),
    body('bio').optional().trim().isLength({ max: 2000 }),
    body('linkedin').optional().trim().isURL().withMessage('Valid LinkedIn URL required'),
    body('twitter').optional().trim().isURL().withMessage('Valid Twitter URL required'),
  ],

  // Event RSVP
  eventRSVP: [
    body('eventId').isMongoId().withMessage('Valid event ID required'),
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('company').optional().trim(),
    body('jobTitle').optional().trim(),
    body('dietaryRequirements').optional().trim(),
    body('attendanceType').optional().isIn(['in-person', 'virtual']),
    body('notes').optional().trim(),
  ],

  // Job Application
  jobApplication: [
    body('jobId').isMongoId(),
    body('firstName').trim().isLength({ min: 2, max: 50 }),
    body('lastName').trim().isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').trim().notEmpty(),
    body('coverLetter').optional().trim().isLength({ max: 5000 }),
    body('linkedIn').optional().trim().isURL(),
    body('portfolio').optional().trim().isURL(),
    body('yearsOfExperience').optional().isInt({ min: 0, max: 50 }),
    body('currentEmployer').optional().trim(),
    body('noticePeriod').optional().trim(),
    body('expectedSalary').optional().trim(),
  ],

  trackApplication: [
    body('referenceNumber').trim().matches(/^IPMC-[A-F0-9]{6}$/i).withMessage('Valid reference number required'),
    body('email').isEmail().normalizeEmail(),
  ],

  updateApplicationStatus: [
    body('status').isIn(['submitted', 'under-review', 'shortlisted', 'interview', 'rejected', 'hired', 'withdrawn']),
    body('note').optional().trim(),
  ],

  // Pagination
  pagination: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
};
