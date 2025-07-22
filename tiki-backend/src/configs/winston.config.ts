import winston from 'winston';
import expressWinston from 'express-winston';

// Custom format cho console để log dễ đọc
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.align(),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // File log vẫn giữ JSON
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: consoleFormat, // Sử dụng custom format cho console
    }),
  ],
});

// Express middleware cho request logging
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: consoleFormat, // Sử dụng custom format cho console
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // File log vẫn giữ JSON
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
});

export { logger, requestLogger };
