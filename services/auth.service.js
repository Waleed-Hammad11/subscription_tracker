import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

export const registerUser = async (userData) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { name, email, password } = userData;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new AppError('User already exists', 409);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUsers = await User.create(
			[{ name, email, password: hashedPassword }],
			{ session },
		);

		const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		await session.commitTransaction();
		session.endSession();

		return { token, user: newUsers[0] };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

export const authenticateUser = async (credentials) => {
	const { email, password } = credentials;
	const user = await User.findOne({ email });

	if (!user) {
		throw new AppError('User not found', 404);
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new AppError('Invalid password', 401);
	}

	const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});

	return { token, user };
};
