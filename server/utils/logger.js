import winston from 'winston';
import 'winston-daily-rotate-file';

// Configure the daily rotate file transport
const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/server-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true, // Compress old logs
  maxSize: '20m', // Max size of each log file
  maxFiles: '14d' // Keep logs for 14 days
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    transport,
    new winston.transports.Console({ // Log to the console as well
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export default logger;
