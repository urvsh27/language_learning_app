// Import models
const questionsModel = require('../models').questions;
const exercisesModel = require('../models').exercises;

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
} = require('../utils/messages');
const Sequelize = require('sequelize');
const db = require('../models/index');

module.exports = {


  /*
  Create question
  */
  async createQuestion(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      let newQuestionId = '';
      const exerciseDetails = await globalController.getModuleDetails(
        exercisesModel,
        'findOne',
        { id: req.body.exerciseId},
        ['id'],
        true
      );
      if (IsNotNullOrEmpty(exerciseDetails.id)) {
        await db.sequelize.transaction(
          {
            deferrable: Sequelize.Deferrable.SET_DEFERRED,
          },
          async (t1) => {
            await questionsModel
              .create(req.body, { transaction: t1 })
              .then(async (newQuestionDetails) => {
                if (newQuestionDetails.id) {
                  newQuestionId = newQuestionDetails.id;
                } else {
                  throw new Error(questionsMessages.questionCreateFail);
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
        throw new Error(exercisesMessages.exerciseNotFound);
      }
      await globalController.updateExerciseTotalMarks(exerciseDetails.id);
      successObjectRes.message = questionsMessages.questionCreateSuccess;
      successObjectRes.data = await globalController.getModuleDetails(
        questionsModel,
        'findOne',
        { id: newQuestionId },
        [
          'id',
          'question',
          'options',
          'correctAnswer',
          'marks',
          'activated',
          'deleted',
        ],
        true
      );
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },


  /*
 Get All questions
 */
  async getAllQuestions(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      const exerciseId = req.params.id;
      const exerciseDetails = await globalController.getModuleDetails(
        exercisesModel,
        'findOne',
        { id: exerciseId },
        ['id'],
        true
      );
      if (IsNotNullOrEmpty(exerciseDetails.id)) {
        const questionsDetails = await globalController.getModuleDetails(
          questionsModel,
          'findAll',
          { exerciseId: exerciseId, activated: true, deleted: false },
          [
            ['id', 'questionId'],
            ['question', 'questionName'],
            'options',
            'correctAnswer',
            'marks',
            'activated',
            'deleted',
          ],
          true, 
          '',
          [['updatedAt', 'DESC']]
        );
        successArrRes.message = questionsMessages.questionsFound;
        successArrRes.data = questionsDetails;
      } else {
        throw new Error(exercisesMessages.exerciseNotFound);
      }
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },



  /*
  Update question
  */
  async updateQuestion(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      const questionId = req.params.id;
      const questionDetails = await globalController.getModuleDetails(
        questionsModel,
        'findOne',
        { id: req.params.id },
        ['id','marks', 'deleted', 'exerciseId'],
        true
      );
      if (IsNotNullOrEmpty(questionDetails.id)) {
        await db.sequelize.transaction(
          {
            deferrable: Sequelize.Deferrable.SET_DEFERRED,
          },
          async (t1) => {
            if (req.body.deleted === true) {             
              await globalController.updateQuestion(questionId, req.body, t1);
               await globalController.updateExerciseTotalMarks(questionDetails.exerciseId);
            } 
            await globalController.updateQuestion(questionId, req.body, t1);
          }
        );
      } else {
        throw new Error(exercisesMessages.exerciseNotFound);
      }  
      await globalController.updateExerciseTotalMarks(questionDetails.exerciseId);
      const updatedQuestionDetails =  await globalController.getModuleDetails(
        questionsModel,
        'findOne',
        { id: questionId },
        [
          'id',
          'question',
          'options',
          'correctAnswer',
          'marks',
          'activated',
          'deleted',
        ],
        true
      );
      successObjectRes.message = questionsMessages.questionUpdateSuccess;
      successObjectRes.data  =updatedQuestionDetails
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },
};
