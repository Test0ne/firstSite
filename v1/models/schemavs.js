const Joi = require('joi')
module.exports.prSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
        //rating: Joi.number().required(),
        //ratings: Joi.number().required(),
        //comments: Joi.array().required()
    }).required()
});
module.exports.psSchema = Joi.object({
    post: Joi.object({
        username: Joi.string().required(),
        comment: Joi.string().required()
    }).required()
});
module.exports.uSchema = Joi.object({
    register: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required().min(8).max(32),
        email: Joi.string().required()
    }).required()
});
module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        username: Joi.string().required(),
        comment: Joi.string().required()
    }).required()
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        username: Joi.string().required(),
        comment: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
});
