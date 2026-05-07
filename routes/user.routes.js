import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => {
	res.send('hello world');
});

userRouter.get('/', (req, res) => {
	res.send('hello world');
});

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
