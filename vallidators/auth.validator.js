import Joi from 'joi';

export const signUpSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    
    email: Joi.string().trim().lowercase().email().required(),
    
    password: Joi.string().min(6).required(),
});

export const signInSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    
    password: Joi.string().required(),
});