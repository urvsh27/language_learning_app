//Import validators
const register = require('./register.validator');
const login = require('./login.validator');
const moduleId = require('./moduleId.validator');
const exercises = require('./exercises.validator');
const exercisesUpdate= require('./exercisesUpdate.validator');
const questionCreate = require('./questionCreate.validator');
const userPreference = require('./userPreference.validator');
const endQuiz = require('./endQuiz.validator');
module.exports = {
    register,
    login,
    moduleId,
    exercises,
    exercisesUpdate,
    questionCreate,
    userPreference,
    endQuiz
};