const Joi = require('joi');
const question =  Joi.string().label('Question');
 const options =  Joi.array().items(Joi.string()).length(4).label('Options');
 const correctAnswer =  Joi.number().integer().min(0).max(3).label('Correct Answer');
 const marks =  Joi.number().integer().min(1).max(10).label('Marks');

const questionUpdateSchema = Joi.object({
    question,
    options,
    correctAnswer,
    marks,
});

module.exports = questionUpdateSchema;
