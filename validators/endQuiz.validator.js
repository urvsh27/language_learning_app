const Joi = require('joi');
const questionId = Joi.any().label('Question Id');
const selectedOptionIndex = Joi.any().label('Selected option index');
const userEndQuizData = Joi.array().items(Joi.object({
    questionId,
    selectedOptionIndex
})).required().label('User end quiz data');

const endQuizSchema = Joi.object({
    userEndQuizData
});

module.exports = endQuizSchema;
