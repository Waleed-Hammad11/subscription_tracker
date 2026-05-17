import Joi from 'joi';

export const createSubscriptionSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    
    price: Joi.number().min(0).required(),
    
    currency: Joi.string().valid('USD', 'EUR', 'GBP').default('USD'),
    
    frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
    
    category: Joi.string().valid(
        'sports', 'entertainment', 'news', 'lifestyle', 
        'technology', 'finance', 'politics', 'other'
    ).required(),
    
    paymentMethod: Joi.string().hex().length(24).required(),
    
    status: Joi.string().valid('active', 'cancelled', 'expired').default('active'),
    
    startDate: Joi.date().max('now').required(),
    
    renewalDate: Joi.date().greater(Joi.ref('startDate')).required(),
    
    user: Joi.string().hex().length(24).required()
});