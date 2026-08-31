require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { apiLimiter, authLimiter, contactLimiter, newsletterLimiter, rsvpLimiter, jobApplicationLimiter, csrfFailureLimiter } = require('./middleware/rateLimiter');
const { requestLogger, slowRequestLogger } = require('./middleware/requestLogger');
const { csrfProtection } = require('./middleware/csrf');
const errorHandler = require('./middleware/errorHandler');
const { initSentry, sentryErrorHandler } = require('./utils/sentry');

const app = express();

// Trust proxy for accurate IP detection behind reverse proxy
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
    },
  },
}));

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Compression
app.use(compression());

// Sentry monitoring
initSentry(app);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// MongoDB operator injection protection
app.use(mongoSanitize());

// Global rate limiting
app.use(apiLimiter);
app.use(requestLogger);
app.use(slowRequestLogger(1000));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip, userAgent: req.headers['user-agent'] });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// API Routes
// API v1 routes
app.use('/api/v1/auth', authLimiter, require('./routes/auth'));
app.use('/api/v1/contact', contactLimiter, require('./routes/contact'));
app.use('/api/v1/newsletter', newsletterLimiter, require('./routes/newsletter'));
app.use('/api/v1/blog', require('./routes/blog'));
app.use('/api/v1/services', require('./routes/services'));
app.use('/api/v1/team', require('./routes/team'));
app.use('/api/v1/esg', require('./routes/esg'));
app.use('/api/v1/jobs', require('./routes/jobs'));
app.use('/api/v1/job-applications', jobApplicationLimiter, require('./routes/jobApplications'));
app.use('/api/v1/events', require('./routes/events'));
app.use('/api/v1/event-rsvp', rsvpLimiter, require('./routes/eventRSVP'));
app.use('/api/v1/partners', require('./routes/partners'));
app.use('/api/v1/settings', require('./routes/settings'));
app.use('/api/v1/analytics', require('./routes/analytics'));
app.use('/api/v1/search', require('./routes/search'));
app.use('/api/v1/upload', require('./routes/upload'));

// Legacy /api/* redirects to /api/v1/* (for backward compatibility during transition)
app.use('/api/auth', (req, res) => res.redirect(308, '/api/v1/auth' + req.url));
app.use('/api/contact', (req, res) => res.redirect(308, '/api/v1/contact' + req.url));
app.use('/api/blog', (req, res) => res.redirect(308, '/api/v1/blog' + req.url));
app.use('/api/services', (req, res) => res.redirect(308, '/api/v1/services' + req.url));
app.use('/api/search', (req, res) => res.redirect(308, '/api/v1/search' + req.url));

// CSRF-protected routes (state-changing operations)
app.use(csrfFailureLimiter);
app.use(csrfProtection);

// Static sitemap and robots
app.get('/sitemap.xml', async (req, res) => {
  try {
    const { generateSitemap } = require('./utils/sitemapGenerator');
    const xml = await generateSitemap();
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    logger.error('Sitemap generation failed', { error: error.message });
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/robots.txt', (req, res) => {
  const { generateRobots } = require('./utils/robotsGenerator');
  res.header('Content-Type', 'text/plain');
  res.send(generateRobots());
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(sentryErrorHandler());
app.use(errorHandler);

// Global error handlers
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', { error: err.message, stack: err.stack });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server (only if not in test mode)
let server;
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, { env: process.env.NODE_ENV });
    });
  }).catch(err => {
    logger.error('Database connection failed', { error: err.message });
    process.exit(1);
  });
}

module.exports = { app, server };
