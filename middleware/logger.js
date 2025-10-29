const winston = require('winston');

// winston logger with timestamp and simple console output
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/access.log' })
  ]
});


function requestLogger(req, res, next) {
  logger.info(`${req.method} ${req.originalUrl} | IP: ${req.ip}`);
  next();
}

module.exports = requestLogger;
