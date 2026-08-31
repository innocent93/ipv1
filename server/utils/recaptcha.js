const axios = require('axios');
const logger = require('./logger');

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

exports.verifyRecaptcha = async (token) => {
  if (!RECAPTCHA_SECRET) {
    logger.warn('RECAPTCHA_SECRET_KEY not set — skipping verification');
    return { success: true, score: 1.0 };
  }

  if (!token) {
    throw new Error('reCAPTCHA token required');
  }

  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: RECAPTCHA_SECRET,
        response: token,
      },
      timeout: 5000,
    });

    if (!response.data.success) {
      logger.warn('reCAPTCHA verification failed', { errorCodes: response.data['error-codes'] });
      throw new Error('reCAPTCHA verification failed');
    }

    // For v3, check score
    if (response.data.score !== undefined && response.data.score < 0.5) {
      logger.warn('reCAPTCHA score too low', { score: response.data.score });
      throw new Error('Suspicious activity detected');
    }

    return response.data;
  } catch (error) {
    logger.error('reCAPTCHA verification error', { error: error.message });
    throw new Error('Could not verify reCAPTCHA');
  }
};
