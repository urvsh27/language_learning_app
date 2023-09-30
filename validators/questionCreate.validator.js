const Joi = require('joi');
 const question =  Joi.string().required().label('Question');
 const options =  Joi.array().items(Joi.string()).required().length(4).label('Options');
 const correctAnswer =  Joi.number().integer().required().label('Correct Answer');
 const marks =  Joi.number().integer().max(10).required().label('Marks');
 const exerciseId =  Joi.string().required().label('Exercise Id');

const questionCreateSchema = Joi.object({
    question,
    options,
    correctAnswer,
    marks,
    exerciseId
});

module.exports = questionCreateSchema;
