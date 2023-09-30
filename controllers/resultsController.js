// Import models
const usersModel = require('../models').users;
const rolesModel = require('../models').roles;
const userRolesModel = require('../models').user_roles;
const userPreferencesModel = require('../models').user_preferences;
const languagesModel = require('../models').languages;
const exercisesModel = require('../models').exercises;
const resultsModel = require('../models').results;

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
      await languagesModel.findAll({
        attributes : ['id', 'name'],
        where: { activated: true, deleted: false, id:'fbb9e4c3-924f-4f5e-92e8-fa42ec31c912' },
        include : [{
          model : exercisesModel,
          attributes: ['id', 'exerciseWeightage','totalMarks'],
          where: { activated: true, deleted: false },
          include: [
            {
              model: resultsModel,
              attributes: ['id', 'obtainedMarks', 'exerciseId', 'userId'], 
            },
          ],
        }],
        required : false,
        raw: false,
      }).then((responseDetails) => {
        getUsersLeaderboardDetails = responseDetails;
        console.log(responseDetails);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
      await exercisesModel
        .findAll({
          attributes: ['id', 'exerciseWeightage','totalMarks'],
          where: { activated: true, deleted: false },
          include: [
            {
              model: resultsModel,
              attributes: ['id', 'obtainedMarks', 'exerciseId'],
              required: false,
            },
          ],
          raw: false,
        })
      
      successArrRes.message = 'Data found successfully.';
      successArrRes.data = getUsersLeaderboardDetails;
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },
};
