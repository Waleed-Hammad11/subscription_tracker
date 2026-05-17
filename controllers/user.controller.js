import { asyncHandler } from '../middlewares/async.middleware.js';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

export const getUsers = async (req, res, next) => {
	try {
		const users = await User.find({});
		res.status(200).json({ success: true, users });
	} catch (error) {
		next(error);
	}
};

export const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id).select('-password');

	if (!user) {
		return next(new AppError('User not found', 404));
	}

	res.status(200).json({ success: true, user });
});
