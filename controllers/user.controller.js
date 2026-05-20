import * as userService from '../services/user.service.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

export const getUsers = asyncHandler(async (req, res) => {
	const users = await userService.getAllUsers();

	res.status(200).json({
		success: true,
		users,
	});
});

export const getUser = asyncHandler(async (req, res) => {
	const user = await userService.getUserById(req.params.id);

	res.status(200).json({
		success: true,
		user,
	});
});
