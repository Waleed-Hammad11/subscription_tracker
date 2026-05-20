import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

export const signUp = asyncHandler(async (req, res) => {
	const result = await authService.registerUser(req.body);

	res.status(201).json({
		success: true,
		message: 'User created successfully',
		data: result,
	});
});

export const signIn = asyncHandler(async (req, res) => {
	const result = await authService.authenticateUser(req.body);

	res.status(200).json({
		success: true,
		message: 'User logged in successfully',
		data: result,
	});
});
