// Import models
const usersModel = require('../models').users;
const exercisesModel = require('../models').exercises;
const resultsModel = require('../models').results;
const languagesModel = require('../models').languages;

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
const { resultsMessages, userMessages } = require('../utils/messages');
const Sequelize = require('sequelize');
const db = require('../models/index');
const { Op } = require('sequelize');

module.exports = {
  async getUsersLeaderboard(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      let exerciseData = await globalController.getModuleDetails(
        exercisesModel,
        'findAll',
        { languageId: req.params.id },
        [['id', 'exerciseId'], 'totalMarks', 'exerciseWeightage'],
        true
      );
      if (IsNotNullOrEmpty(exerciseData));
      {
        let usersDetails = await globalController.getModuleDetails(
          usersModel,
          'findAll',
          {
            email: {
              [Op.not]: 'admin@gmail.com',
            },
            activated: true,
            deleted: false,
          },
          ['id', 'name'],
          true
        );
        for (let i = 0; i < usersDetails.length; i++) {
          let languagePercentage = 0;
          let resultData = await globalController.getModuleDetails(
            resultsModel,
            'findAll',
            { userId: usersDetails[i].id },
            ['id', 'userId', 'exerciseId', 'obtainedMarks'],
            true
          );
          if (IsNotNullOrEmpty(resultData)) {
            if (exerciseData.length > 0) {
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
                  const calculation =
                    (obtainedMarks / totalMarks) * exerciseWeightage;
                  return {
                    exerciseId: result.exerciseId,
                    calculationResult: calculation,
                  };
                } else {
                  return {
                    exerciseId: result.exerciseId,
                    calculationResult: 0,
                  };
                }
              });
              languagePercentage = finalCalculation.reduce(
                (total, item) => total + item.calculationResult,
                0
              );
            }
          }

          usersDetails[i].languagePercentage = IsNotNullOrEmpty(
            languagePercentage
          )
            ? languagePercentage
            : '0';
          switch (true) {
            case languagePercentage >= 91 && languagePercentage <= 100:
              usersDetails[i].proficiencyLevel = 'Fluent';
              break;
            case languagePercentage >= 71 && languagePercentage <= 90:
              usersDetails[i].proficiencyLevel = 'Advanced';
              break;
            case languagePercentage >= 41 && languagePercentage <= 70:
              usersDetails[i].proficiencyLevel = 'Intermediate';
              break;
            case languagePercentage >= 0 && languagePercentage <= 40:
              usersDetails[i].proficiencyLevel = 'Beginner';
              break;
            default:
              usersDetails[i].proficiencyLevel = 'Beginner';
          }
          const sortedUsersDetails = usersDetails.sort(
            (a, b) => b.languagePercentage - a.languagePercentage
          );
          successArrRes.data = sortedUsersDetails;
        }
        successArrRes.message = resultsMessages.leaderBoardResultFound;
      }
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },

  async geUserProgress(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      const userProgressDetails = await globalController.getUserProgressDetails(
        req,
        res
      );

      successArrRes.message = userMessages.userProgressDetailsFound;
      successArrRes.data = userProgressDetails;
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },

  async deleteUserProgress(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      const userId = req.headers.loggedInUserId;
      const resultsDetails = await globalController.getModuleDetails(
        resultsModel,
        'findAll',
        { userId: userId },
        ['id', 'exerciseId', 'userId'],
        true,
        [{
          model : exercisesModel,
          attributes : [],
          where : {languageId : req.params.id},
          required : true
        }],
      );
      if(IsNotNullOrEmpty(resultsDetails)){
        for (let i = 0; i < resultsDetails.length; i++) {
          await resultsModel.destroy({
            where: {
              exerciseId : resultsDetails[i].exerciseId,
              userId: userId
            },
          })
          .catch(async (error) => {
            let message =   
              await globalController.getMessageFromErrorInstance(error);
            if (message) {
              throw new Error(message);
            } else {
              throw new Error(error.message);
            }
          });
        }
      }
      successArrRes.message = userMessages.userProgressDeleteSuccess;
      successArrRes.data = [];
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },
};
