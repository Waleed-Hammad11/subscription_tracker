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
import { ALLOWED_ORIGINS } from './config/env.js';
const app = express();

app.use(helmet());

app.use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
);

app.use(compression());

app.use(morganMiddleware);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.use(hpp());

app.use((req, res, next) => {
    if (req.body) {
        req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    }

    if (req.params) {
        req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
    }

    if (req.query) {
        const sanitized = mongoSanitize.sanitize({ ...req.query }, { replaceWith: '_' });
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, sanitized);
    }

    next();
});


app.use('/api/v1', globalLimiter);
app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;