//Import controllers
const userController = require('./usersController');
const globalController = require('./globalController');
const languagesController = require('./languagesController');
const exercisesController = require('./exercisesController');
const questionsController = require('./questionsController');
const quizzesController = require('./quizzesController');
const resultsController = require('./resultsController');
module.exports = {
    userController,
    globalController,
    languagesController,
    exercisesController,
    questionsController,
    quizzesController,
    resultsController
}