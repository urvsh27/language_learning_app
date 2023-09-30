const Joi = require('joi');
const languageId =Joi.string().required().label('Language Id');

const userPreferenceSchema = Joi.object({
    languageId
});

module.exports = userPreferenceSchema;