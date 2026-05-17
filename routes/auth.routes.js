import { Router } from 'express';
import { signIn, signUp } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { signInSchema, signUpSchema } from '../vallidators/auth.validator.js';

const authRouter = Router();

authRouter.post('/sign-up',validate(signUpSchema), signUp);
authRouter.post('/sign-in',validate(signInSchema), signIn);
// authRouter.post('sign-out', signOut);

export default authRouter;
