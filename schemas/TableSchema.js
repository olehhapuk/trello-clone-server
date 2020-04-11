const Joi = require('@hapi/joi');

const ListSchema = Joi.object({
    title: Joi.string().min(3).max(50).required()
});

module.exports = ListSchema;