import winston from 'winston';

const { combine, timestamp, json, errors, printf } = winston.format;

// Custom format for console output (development)
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message}`;

  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  return msg;
});

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
  defaultMeta: {
    service: 'expense-manager-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? combine(timestamp(), json())
          : combine(timestamp(), consoleFormat)
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json())
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), json())
    })
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })]
});

// Add request logging helper
logger.logRequest = (req, metadata = {}) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.userId || null,
    ...metadata
  });
};

// Add response logging helper
logger.logResponse = (req, res, responseTime, metadata = {}) => {
  logger.info('Outgoing response', {
    method: req.method,
    url: req.url,
    path: req.path,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userId: req.userId || null,
    ...metadata
  });
};

// Add error logging helper
logger.logError = (err, req = null, metadata = {}) => {
  const errorLog = {
    message: err.message,
    stack: err.stack,
    ...metadata
  };

  if (req) {
    errorLog.method = req.method;
    errorLog.url = req.url;
    errorLog.path = req.path;
    errorLog.userId = req.userId || null;
  }

  logger.error('Error occurred', errorLog);
};

export default logger;
