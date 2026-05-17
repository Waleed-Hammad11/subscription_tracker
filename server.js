import app from './app.js';
import { PORT, NODE_ENV } from './config/env.js';
import connectToDatabase from './database/mongodb.js';

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    
    process.exit(1);
});

let server;

connectToDatabase().then(() => {
    server = app.listen(PORT, () => {
        console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on('SIGTERM', () => {
    if (server) {
        server.close(() => {
            console.log('SIGTERM received. Shutting down gracefully.');
        });
    }
});

process.on('SIGINT', () => {
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    }
});