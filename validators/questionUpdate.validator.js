const Joi = require('joi');
const questionId =  Joi.string().required().label('Question Id');

const questionUpdateSchema = Joi.object({
    questionId,
    
});

module.exports = questionUpdateSchema;
