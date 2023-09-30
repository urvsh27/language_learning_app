// Import models
const languagesModel = require('../models').languages;
const exercisesModel = require('../models').exercises;
const questionsModel = require('../models').questions;
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
const { languagesMessages, exercisesMessages } = require('../utils/messages');
const Sequelize = require('sequelize');
const db = require('../models/index');

module.exports = {
  /*
  CreateExercise
  */
  async createExercise(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      console.log(req.body);
      let newExerciseId = '';
      const languageDetails = await globalController.getModuleDetails(
        languagesModel,
        'findOne',
        { id: req.body.languageId },
        ['id'],
        true
      );
      if (IsNotNullOrEmpty(languageDetails.id)) {
        await db.sequelize.transaction(
          {
            deferrable: Sequelize.Deferrable.SET_DEFERRED,
          },
          async (t1) => {
            await exercisesModel
              .create(req.body, { transaction: t1 })
              .then((newExerciseDetails) => {
                if (newExerciseDetails.id) {
                  newExerciseId = newExerciseDetails.id;
                } else {
                  throw new Error(exercisesMessages.exerciseCreateFail);
                }
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
        );
      } else {
        throw new Error(languagesMessages.languageNotFound);
      }
      successObjectRes.message = exercisesMessages.exerciseCreateSuccess;
      successObjectRes.data = await globalController.getModuleDetails(
        exercisesModel,
        'findOne',
        { id: newExerciseId },
        ['id', 'name', 'exerciseWeightage', 'activated', 'deleted'],
        true
      );
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },

  async getSingleExercise(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      const exerciseReturningAttributes =
        await globalController.getExerciseReturningAttributes();
      const exerciseDetails = await globalController.getModuleDetails(
        exercisesModel,
        'findOne',
        { id: req.params.id},
        exerciseReturningAttributes,
        false,
        [
          {
            model: questionsModel,
            attributes: [],
          },
        ]
      );
      if (IsNotNullOrEmpty(exerciseDetails)) {
        successObjectRes.message = exercisesMessages.exercisesFound;
        successObjectRes.data = exerciseDetails;
      } else {
        throw new Error(exercisesMessages.exerciseNotFound);
      }
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },

  /*
 Get all admin exercises
 */
  async getAllAdminExercises(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      const languageDetails = await globalController.getModuleDetails(
        languagesModel,
        'findOne',
        { id: req.params.id },
        ['id', 'name'],
        true
      );
      if (IsNotNullOrEmpty(languageDetails.id)) {
        const exerciseReturningAttributes =
          await globalController.getExerciseReturningAttributes();
        const exercisesDetails = await globalController.getModuleDetails(
          exercisesModel,
          'findAll',
          { languageId: req.params.id, deleted : false },
          exerciseReturningAttributes,
          false,
          [
            {   
              model: questionsModel,
              attributes: ['id'],
            },
          ],
          [['updatedAt', 'DESC']],
        );
        successArrRes.message = exercisesMessages.exercisesFound;
        successArrRes.data = exercisesDetails;
      } else {
        throw new Error(languagesMessages.languageNotFound);
      }

      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },

  /*
   * Update exercise
   */
  async updateExercise(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      const exerciseId = req.params.id;
      const exerciseDetails = await globalController.getModuleDetails(
        exercisesModel,
        'findOne',
        { id: req.params.id },
        ['id', 'exerciseWeightage', 'activated', 'deleted'],
        true
      );
      if (IsNotNullOrEmpty(exerciseDetails.id)) {
        await db.sequelize.transaction(
          {
            deferrable: Sequelize.Deferrable.SET_DEFERRED,
          },
          async (t1) => {
            if (req.body.deleted === true) {
              if(exerciseDetails.activated===true && exerciseDetails.deleted === false){
                throw new Error(exercisesMessages.deActivateExercise);
              }else{
                await globalController.updateExercise(
                  exerciseId,
                  { deleted: req.body.deleted },
                  t1
                );
              }
            } else if (req.body.activated === true) {
              const checkExerciseActivateTrueCondition = await globalController.checkExerciseActivateTrueCondition(
                exerciseId, exerciseDetails.exerciseWeightage
              );
              if(checkExerciseActivateTrueCondition){
                await globalController.updateExercise(
                  exerciseId,
                  { activated: req.body.activated },
                  t1
                );
              }else{
                throw new Error(exercisesMessages.exerciseActivateFail);
              }
            } else if (req.body.activated === false) {
              await globalController.updateExercise(
                exerciseId,
                { activated: req.body.activated },
                t1
              );
            }
            if (req.body.name) {
              await globalController.updateExercise(
                exerciseId,
                { name: req.body.name , exerciseWeightage: req.body.exerciseWeightage},
                t1
              );
            }
          }
        );
      } else {
        throw new Error(exercisesMessages.exerciseNotFound);
      }
      successObjectRes.message = exercisesMessages.exerciseUpdateSuccess;
      successObjectRes.data = await globalController.getModuleDetails(
        exercisesModel,
        'findOne',
        { id: exerciseId },
        ['id', 'name', 'exerciseWeightage', 'activated', 'deleted'],
        true
      );
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },

  /*
  Get all user exercises
  */
  async getAllUserExercises(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      const languageDetails = await globalController.getModuleDetails(
        languagesModel,
        'findOne',
        { id: req.params.id },
        ['id', 'name'],
        true
      );
      if (IsNotNullOrEmpty(languageDetails.id)) {
        let exercisesDetails = await globalController.getModuleDetails(
          exercisesModel,
          'findAll',
          { languageId: req.params.id, activated:true, deleted:false },
          [
            'id',
            'name',
            'exerciseWeightage',
            'activated',
            'deleted',
          ],
          false,
          [
            {   
              model: questionsModel,
              attributes: ['id'],
            },{
              model : resultsModel,
              attributes:['obtainedMarks'],
              where : {userId : req.headers.loggedInUserId},
              required : false
            }
          ],
          [['updatedAt', 'DESC']],
        );
        exercisesDetails = exercisesDetails.map((item) => ({
          exerciseId : item.id,
          exerciseName : item.name,
          exerciseWeightage :item.exerciseWeightage ,
          activated  : item.activated,
          deleted : item.deleted , 
          questions : item.questions,
          userObtainedMarks: IsNotNullOrEmpty(item.results[0]) ? item.results[0]['obtainedMarks'] : 0
        }));
        successArrRes.message = exercisesMessages.exercisesFound;
        successArrRes.data = exercisesDetails;
      } else {
        throw new Error(languagesMessages.languageNotFound);
      }

      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },
};
