const Joi = require('@hapi/joi');

const CardSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    body: Joi.string().min(5).max(255),
    parentList: Joi.string()
});

module.exports = CardSchema;