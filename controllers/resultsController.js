// Import models
const usersModel = require('../models').users;
const rolesModel = require('../models').roles;
const userRolesModel = require('../models').user_roles;
const userPreferencesModel = require('../models').user_preferences;
const languagesModel = require('../models').languages;
const exercisesModel = require('../models').exercises;
const resultsModel = require('../models').results;
const questionsModel = require('../models').questions;

//Import controllers
const globalController = require('./globalController');

//Import files
const {
  successArrayResponse,
  errorArrayResponse,
  successObjectResponse,
  errorObjectResponse,
} = require('../utils/response');
const { IsNotNullOrEmpty } = require('../utils/enum');
const {
  languagesMessages,
  questionsMessages,
  exercisesMessages,
  quizzesMessages,
  generalMessages,
  resultsMessages,
} = require('../utils/messages');
const Sequelize = require('sequelize');
const db = require('../models/index');

module.exports = {
  async getUsersLeaderboard(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      let getUsersLeaderboardDetails = [];
      // await usersModel.findAll({
      //   attributes : ['id','name'],
      //   where : {activated : true, deleted : false},
      //   include: [{
      //     model : resultsModel,
      //     attributes : ['id','userId', 'exerciseId' , 'obtainedMarks'],
      //     include : [{
      //       model : exercisesModel,
      //       attributes : [['id','exerciseId'], 'totalMarks'],
      //       include : [{
      //         model : questionsModel,
      //         attributes : [['id','questionId'], 'marks'],
      //       }],
      //     }],
      //     required : false,
      //   }, {
      //     model : userPreferencesModel,
      //     attributes : ['id','userId', 'languageId']
      //   }],
      //   required : false,
      //   raw: false,
      // })

      const exerciseData = await globalController.getModuleDetails(
        exercisesModel,
        'findAll',
        { languageId: 'fbb9e4c3-924f-4f5e-92e8-fa42ec31c912' },
        [['id', 'exerciseId'], 'totalMarks', 'exerciseWeightage'],
        true
      );
      console.log(exerciseData);
      const resultData = await globalController.getModuleDetails(
        resultsModel,
        'findAll',
        {},
        ['id', 'userId', 'exerciseId', 'obtainedMarks'],
        true
      );

      console.log(resultData);
      const finalCalculation = resultData.map((result) => {
        const matchingExercise = exerciseData.find(
          (exercise) => exercise.exerciseId === result.exerciseId
        );

        if (matchingExercise) {
          const obtainedMarks = parseFloat(result.obtainedMarks);
          const totalMarks = parseFloat(matchingExercise.totalMarks);
          const exerciseWeightage = parseFloat(
            matchingExercise.exerciseWeightage
          );
          const calculation = (obtainedMarks / totalMarks) * exerciseWeightage;
          return {
            exerciseId: result.exerciseId,
            calculationResult: calculation,
          };
        } else {
          return {
            exerciseId: result.exerciseId,
            calculationResult: 'Exercise ID not found in exerciseData',
          };
        }
      });

      console.log(finalCalculation);

      const sum = finalCalculation.reduce(
        (total, item) => total + item.calculationResult,
        0
      );
      console.log('Sum of final calculation results:', sum);
      successArrRes.data = { finalCalculation, sum };
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },
};
