import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

export const getAllUsers = async () => {
	return await User.find({});
};

export const getUserById = async (userId) => {
	const user = await User.findById(userId).select('-password');

	if (!user) {
		throw new AppError('User not found', 404);
	}

	return user;
};
