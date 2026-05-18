import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { authLimiter, globalLimiter } from './middlewares/ratelimiter.middleware.js';
import morganMiddleware from './middlewares/morgan.middleware.js';
import AppError from './utils/appError.js';
import logger from './utils/logger.js';

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
);

app.use(compression());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(hpp());

app.use(
    mongoSanitize({
        replaceWith: '_',
        allowDots: true,
        onSanitize: ({ req, key }) => {
            logger.warn(
                `[Security Alert] Malicious payload detected in "${key}" from IP: ${req.ip}`,
            );
        },
    }),
);

app.use(morganMiddleware);

app.use('/api/v1', globalLimiter);
app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;