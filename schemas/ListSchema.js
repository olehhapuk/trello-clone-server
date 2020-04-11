const Joi = require('@hapi/joi');

const ListSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    parentTable: Joi.string()
});

module.exports = ListSchema;