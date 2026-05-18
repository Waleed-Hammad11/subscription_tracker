import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'info';
};

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
);

const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
        ({ timestamp, level, message, stack }) =>
            stack
                ? `[${timestamp}] ${level}: ${message}\n${stack}`
                : `[${timestamp}] ${level}: ${message}`,
    ),
);

const sharedRotateOptions = {
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',  
    zippedArchive: true,
    format: fileFormat,
};

const transports = [
    new winston.transports.Console({
        format: consoleFormat,
    }),

    new DailyRotateFile({
        ...sharedRotateOptions,
        filename: 'logs/error-%DATE%.log',
        level: 'error',
    }),

    new DailyRotateFile({
        ...sharedRotateOptions,
        filename: 'logs/all-%DATE%.log',
    }),
];

const logger = winston.createLogger({
    level: level(),
    format: fileFormat,
    transports,
    exitOnError: false,
});

export default logger;