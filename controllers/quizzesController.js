// Import models
const questionsModel = require('../models').questions;
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
const { exercises } = require('../validators');

module.exports = {

  /*
 Get All question
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
            'marks',
            'activated',
            'deleted',
          ],
          true, 
          '',
          [['createdAt', 'ASC']]
        );
        successArrRes.message = quizzesMessages.quizStartSuccess;
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
  End Quiz
  */
  async endQuiz(req,res){
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      console.log(req.body);
      let obtainedMarks = 0;
      const exerciseId = req.params.id;
      const requestBodyQuizArray= req.body.userEndQuizData;
      const exerciseDetails = await globalController.getModuleDetails(exercisesModel,'findOne',{id:req.params.id, activated:true, deleted:false},['id'],true);
      if(IsNotNullOrEmpty(exerciseDetails.id)){
            const questionsDetails= await globalController.getModuleDetails(questionsModel,'findAll',{activated:true, deleted:false}, [
              ['id', 'questionId'],
              'correctAnswer',
              'marks',
            ],true);
            if(IsNotNullOrEmpty(questionsDetails)){
            requestBodyQuizArray.forEach(userQuizQuestion => {
              const correspondingQuestion = questionsDetails.find(question => question.questionId === userQuizQuestion.questionId);
              if (correspondingQuestion) {
                parseInt(correspondingQuestion.correctAnswer);
                console.log('selected', userQuizQuestion.selectedOptionIndex)
                if (correspondingQuestion.correctAnswer == userQuizQuestion.selectedOptionIndex) {
                  obtainedMarks += parseInt(correspondingQuestion.marks);
                }
              }
            });
            const generateResult = await globalController.createOrUpdateUserExerciseResult(obtainedMarks,exerciseDetails.id,  req.headers.loggedInUserId);
            if(generateResult){
              successObjectRes.message = resultsMessages.resultCreateSuccess;
              successObjectRes.data = await globalController.getModuleDetails(resultsModel,'findOne',{exerciseId:exerciseId,userId : req.headers.loggedInUserId},['id','obtainedMarks','exerciseId','userId'],true);        
            }else{
              throw new Error(resultsMessages.resultGenerateFail);
            }
          }else{
              throw new Error(questionsMessages.questionsNotFound);
            }   
      }else{
        throw new Error(exercisesMessages.exerciseNotFound);
      }
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  }
};
