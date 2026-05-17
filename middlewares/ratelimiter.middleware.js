import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

export const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: 'Too many login attempts, please try again after a minute'
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false
});