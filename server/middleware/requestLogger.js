const logger = require('./logger');

exports.requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user?.id,
  });

  // Capture response
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - start;

    // Don't log large response bodies or file uploads
    const bodyPreview = typeof body === 'string' && body.length < 1000 
      ? body.substring(0, 200) 
      : '[truncated]';

    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      bodyPreview,
      userId: req.user?.id,
    });

    originalSend.call(this, body);
  };

  next();
};

exports.slowRequestLogger = (thresholdMs = 1000) => {
  return (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (duration > thresholdMs) {
        logger.warn('Slow request detected', {
          method: req.method,
          path: req.path,
          duration: `${duration}ms`,
          threshold: `${thresholdMs}ms`,
        });
      }
    });
    next();
  };
};
