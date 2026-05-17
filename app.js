import express from 'express';
import { NODE_ENV, PORT } from './config/env.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import connectToDatabase from './database/mongodb.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import { authLimiter, globalLimiter } from './middlewares/ratelimiter.middleware.js';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import AppError from './utils/appError.js';

const app = express();
app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(hpp());

app.use(
mongoSanitize({
    replaceWith: '_',
    allowDots: true,
    onSanitize: ({ req, key }) => {
    console.warn(`[Security Alert] Malicious payload detected and sanitized in ${key} from IP: ${req.ip}`);
    },
})
);

app.use('/api/v1', globalLimiter);
app.use('/api/v1/auth', authLimiter ,authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.listen(PORT, async () => {
	console.log(`Server started on http://localhost:${PORT}`);
	console.log(`connected to database in ${NODE_ENV} mode`);
	await connectToDatabase();
});

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
export default app;
