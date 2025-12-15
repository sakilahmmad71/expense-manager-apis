import logger from '../config/logger.js';

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log incoming request
  logger.logRequest(req, {
    body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    params: Object.keys(req.params).length > 0 ? req.params : undefined
  });

  // Capture the original end function
  const originalEnd = res.end;

  // Override the end function to log response
  res.end = function (chunk, encoding) {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Log response
    logger.logResponse(req, res, responseTime, {
      contentLength: res.get('content-length') || 0
    });

    // Call the original end function
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Sanitize request body to remove sensitive data
const sanitizeBody = body => {
  if (!body) return undefined;

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken'];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.logError(err, req, {
    body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
    query: Object.keys(req.query).length > 0 ? req.query : undefined
  });

  next(err);
};

export { requestLogger, errorLogger };
