// Import modules
const express = require('express');

// Import controllers
const usersController = require('../controllers/usersController');
const authController = require('../middlewares/auth');
// Import files
const validator = require('../middlewares/validator');
const languagesController = require('../controllers/languagesController');
const { exercisesController, questionsController, quizzesController, resultsController } = require('../controllers');
// Router object
const router = express.Router();

/*
* Authentication routes
*/
// Register route
router.post('/register', validator('register'), usersController.register);
// Login route
router.post('/login', validator('login'), usersController.login);
// Admin login route
router.post('/admin-login', validator('login'), usersController.adminLogin);

// Dashboard
router.get('/user-auth', authController.jwtUserAuthValidate, usersController.dashboard);
// Dashboard
router.get('/admin-auth', authController.jwtAdminAuthValidate, usersController.dashboard);

// Get All Languages
router.get('/languages', authController.jwtUserOrAdminAuthValidate, languagesController.getAllLanguages);

// Create Exercise
router.post('/exercise', authController.jwtAdminAuthValidate,validator('exercises'), exercisesController.createExercise);
// Get Exercises by Language
router.get('/exercises/:id', authController.jwtAdminAuthValidate, validator('moduleId'),exercisesController.getAllAdminExercises);
// Get Exercise
router.get('/exercise/:id', authController.jwtAdminAuthValidate, validator('moduleId'),exercisesController.getSingleExercise);
// Update Exercise
router.patch('/exercise/:id', authController.jwtAdminAuthValidate,validator('exercisesUpdate'), exercisesController.updateExercise);


// Create question
router.post('/question', authController.jwtAdminAuthValidate,validator('questionCreate'), questionsController.createQuestion);
// Get questions by exercise
router.get('/questions/:id', authController.jwtAdminAuthValidate,validator('moduleId'), questionsController.getAllQuestions);
// Update question
router.patch('/question/:id', authController.jwtAdminAuthValidate,validator('moduleId'),validator('questionUpdate'), questionsController.updateQuestion);

// Get User Exercises by Language
router.get('/user-exercises/:id', authController.jwtUserAuthValidate, validator('moduleId'),exercisesController.getAllUserExercises);
// Get user preferences
router.get('/user-settings', authController.jwtUserAuthValidate, usersController.getUserPreferences);
// Create user preference
router.post('/user-preference', authController.jwtUserAuthValidate, validator('userPreference'), usersController.createPreference);
// Get questions by exercise
router.get('/quiz-questions/:id', authController.jwtUserAuthValidate, validator('moduleId'), quizzesController.getAllQuestions);
// Post quiz answers
router.post('/end-quiz/:id', authController.jwtUserAuthValidate,validator('moduleId'), validator('endQuiz'),quizzesController.endQuiz);
// Get leaderboard by language
router.get('/leaderboard/:id', authController.jwtUserAuthValidate,validator('moduleId'),resultsController.getUsersLeaderboard);

module.exports = router;
