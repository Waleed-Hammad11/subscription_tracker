import app from './app.js';
import { PORT, NODE_ENV } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import logger from './utils/logger.js';

let server;

const shutdown = (code) => {
    logger.warn(`Initiating graceful shutdown with code ${code}...`);

    const timeout = setTimeout(() => {
        logger.error('Shutdown timeout reached. Forcing process exit.');
        process.exit(code);
    }, 10000);

    const exitProcess = () => {
        clearTimeout(timeout);
        setTimeout(() => process.exit(code), 500);
    };

    if (server) {
        server.close(() => {
            logger.info('HTTP server closed successfully.');
            exitProcess();
        });
    } else {
        exitProcess();
    }
};


process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
        error: err.name,
        message: err.message,
        stack: err.stack,
    });
    shutdown(1);
});

process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', {
        error: err.name,
        message: err.message,
        stack: err.stack,
    });
    shutdown(1);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    shutdown(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    shutdown(0);
});

const startServer = async () => {
    try {
        await connectToDatabase();
        logger.info('Database connection established successfully.');

        server = app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
            logger.debug(`Environment: ${NODE_ENV}`);
        });

        server.on('error', (err) => {
            logger.error('HTTP server error', {
                error: err.name,
                message: err.message,
            });
            shutdown(1);
        });
    } catch (error) {
        logger.error('Failed to initialize application', {
            error: error.name,
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
};

await startServer();