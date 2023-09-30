    const Joi = require('joi');
const name =Joi.string().required().label('Name');
const languageId =Joi.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).required().label('Language Id');

const exercisesSchema = Joi.object({
    name,
    languageId,
    
});

module.exports = exercisesSchema;
