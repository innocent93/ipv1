const rateLimit = require('express-rate-limit');
const logger = require('./logger');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
    res.status(429).json({ success: false, message: 'Too many requests, please try again later.' });
  },
});

// Stricter limiter for auth endpoints
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', { ip: req.ip, path: req.path });
    res.status(429).json({ success: false, message: 'Too many login attempts. Please try again after 15 minutes.' });
  },
});

// Contact form rate limiter (per IP)
exports.contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  handler: (req, res) => {
    logger.warn('Contact form rate limit exceeded', { ip: req.ip });
    res.status(429).json({ success: false, message: 'Too many contact submissions. Please try again in an hour.' });
  },
});

// Newsletter signup limiter
exports.newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).json({ success: false, message: 'Too many newsletter signups from this IP.' });
  },
});

// Event RSVP limiter
exports.rsvpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({ success: false, message: 'Too many RSVPs from this IP.' });
  },
});

// Job application limiter
exports.jobApplicationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
  handler: (req, res) => {
    res.status(429).json({ success: false, message: 'Too many job applications from this IP. Please try again tomorrow.' });
  },
});

// Honeypot middleware — catches bots that fill hidden fields
exports.honeypot = (fieldName = 'website') => {
  return (req, res, next) => {
    if (req.body && req.body[fieldName] && req.body[fieldName].trim() !== '') {
      logger.warn('Honeypot triggered — likely bot', { ip: req.ip, field: fieldName, value: req.body[fieldName] });
      // Return fake success to avoid revealing the trap
      return res.status(200).json({ success: true, message: 'Thank you for your submission.' });
    }
    next();
  };
};

// CSRF failure rate limiter — detect brute-force CSRF attempts
exports.csrfFailureLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    logger.warn('CSRF failure rate limit exceeded', { ip: req.ip });
    res.status(429).json({ success: false, message: 'Too many failed security checks.' });
  },
});
