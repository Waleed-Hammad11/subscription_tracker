import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
	PORT,
	NODE_ENV,
	DB_URI,
	JWT_SECRET,
	JWT_EXPIRES_IN
} = process.env;

export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map((url) => url.trim()) 
    : [];