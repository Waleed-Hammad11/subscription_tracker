import { Router } from 'express';
import { getUsers, getUser } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';
import  arcjetMiddleware  from '../middlewares/arcjet.middleware.js';

const userRouter = Router();

userRouter.get('/',arcjetMiddleware ,getUsers);

userRouter.get('/:id',authorize, getUser);

userRouter.put('/', (req, res) => {
	res.send('hello world');
});

userRouter.post('/', (req, res) => {
	res.send('hello world');
});

userRouter.delete('/', (req, res) => {
	res.send('hello world');
});

export default userRouter;
