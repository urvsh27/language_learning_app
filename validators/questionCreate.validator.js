const Joi = require('joi');
 const question =  Joi.string().required().label('Question');
 const options =  Joi.array().items(Joi.string()).required().length(4).label('Options');
 const correctAnswer =  Joi.number().integer().min(0).max(3).required().label('Correct Answer');
 const marks =  Joi.number().integer().min(1).max(10).label('Marks');
 const exerciseId =  Joi.string().required().label('Exercise Id');

const questionCreateSchema = Joi.object({
    question,
    options,
    correctAnswer,
    marks,
    exerciseId
});

module.exports = questionCreateSchema;
