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
