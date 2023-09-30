const Joi = require('joi');
const id =Joi.string().required().label('Module Id');

const moduleIdSchema = Joi.object({
    id
});

module.exports = moduleIdSchema;