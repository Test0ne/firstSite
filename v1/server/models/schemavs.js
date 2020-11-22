const Joi = require('joi');
const passRegex = /[!@#$%^&*(),.?":{}|<>'`/\\]/;

module.exports.prSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
        image: Joi.string().required(),
        seller: Joi.object().required(),
        created: Joi.number().required(),
        description: Joi.string().required()
        //rating: Joi.number().required(),
        //ratings: Joi.number().required(),
        //comments: Joi.array().required()
    }).required()
});
module.exports.psSchema = Joi.object({
    post: Joi.object({
        username: Joi.string().required(),
        userId: Joi.object().required(),
        created: Joi.number().required(),
        comment: Joi.string().required()
    }).required()
});
module.exports.uSchema = Joi.object({
    register: Joi.object({
        username: Joi.string().required().min(3).max(16).custom((v,h) => {
            return passRegex.test(v) ? h.error('any.invalid') : v
        }).messages({
            "string.min": 'Username is too short!<br/>MINIMUM length is <b>{{#limit}}</b>.',
            "string.max": 'Username is too long!<br/>MAXIMUM length is <b>{{#limit}}</b>.',
            "any.invalid": 'Username contains symbols.'
        }),
        password: Joi.string().required().min(8).max(32).messages({
            "string.min": 'Password MINIMUM length is <b>{{#limit}}</b>.',
            "string.max": 'Password MAXIMUM length is <b>{{#limit}}</b>.'
        }),
        email: Joi.string().required()
    }).required()
});
module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        username: Joi.string().required(),
        userId: Joi.object().required(),
        created: Joi.number().required(),
        comment: Joi.string().required()
    }).required()
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        username: Joi.string().required(),
        comment: Joi.string().required(),
        userId: Joi.object().required(),
        created: Joi.number().required(),
        rating: Joi.number().required()
    }).required()
});
