// Import models
const usersModel = require('../models').users;
const rolesModel = require('../models').roles;
const userRolesModel = require('../models').user_roles;
const exercisesModel = require('../models').exercises;
const questionsModel = require('../models').questions;
const resultsModel = require('../models').results;

// Import modules
const moment = require('moment');

//Import files
const { IsNotNullOrEmpty, IsNullOrEmpty } = require('../utils/enum');
const {
  roleMessages,
  userRolesMessages,
  resultsMessages,
  questionsMessages,
} = require('../utils/messages');
const Sequelize = require('sequelize');
const db = require('../models/index');

module.exports = {
  /*
   * modelInstance : modelName
   * query  : findOne,
   * whereCondition : object,
   * returningAttributes : array
   * raw : boolean
   * offset : number
   * limit : number
   * modelIncludeData : object / array of objects
   * order : Array
   */
  async getModuleDetails(
    modelInstance,
    queryName,
    whereCondition,
    returningAttributes,
    raw,
    modelIncludeData,
    order,
    offset,
    limit
  ) {
    try {
      let responseDetails = {};
      const availableQueryNames = [
        'findAll',
        // 'findByPk',
        'findOne',
        'findAndCountAll',
      ];
      if (availableQueryNames.includes(queryName)) {
        if (queryName === 'findOne') {
          await modelInstance
            .findOne({
              attributes: returningAttributes,
              where: whereCondition,
              raw: raw,
              include: modelIncludeData,
              order: order,
              offset: offset,
              limit: limit,
            })
            .then((queryResult) => {
              if (IsNotNullOrEmpty(queryResult)) {
                responseDetails = queryResult;
              }
            })
            .catch((error) => {
              throw new Error(error.message);
            });
        } else if (queryName === 'findAll') {
          await modelInstance
            .findAll({
              attributes: returningAttributes,
              where: whereCondition,
              raw: raw,
              include: modelIncludeData,
              order: order,
              offset: offset,
              limit: limit,
            })
            .then((queryResult) => {
              if (IsNotNullOrEmpty(queryResult)) {
                responseDetails = queryResult;
              }
            })
            .catch((error) => {
              throw new Error(error.message);
            });
        } else if (queryResult === 'findAndCountAll') {
          await modelInstance
            .findAndCountAll({
              attributes: returningAttributes,
              where: whereCondition,
              raw: raw,
              include: modelIncludeData,
              order: order,
              offset: offset,
              limit: limit,
            })
            .then((queryResult) => {
              if (IsNotNullOrEmpty(queryResult)) {
                responseDetails = queryResult;
              }
            })
            .catch((error) => {
              throw new Error(error.message);
            });
        }
      } else {
        throw new Error(`${queryName} method is not available.`);
      }
      return responseDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
  errors= [
    ValidationErrorItem {
      message: 'email must be unique',
      type: 'unique violation',
      path: 'email',
      value: 'urvish@gmail.com',
      origin: 'DB',
      instance: [users],
      validatorKey: 'not_unique',
      validatorName: null,
      validatorArgs: []
    }
  ],
  */

  /*
   * Instants Models error handler
   */
  async getMessageFromErrorInstance(error) {
    try {
      let message = '';
      if (error instanceof Sequelize.ForeignKeyConstraintError) {
        (message = 'Foreign key constraint error'), error.message;
      } else if (error instanceof Sequelize.ValidationError) {
        let validationErrorArray = error.errors;
        if (validationErrorArray.length > 0) {
          for (let i = 0; i < validationErrorArray.length; i++) {
            if (message != '') {
              message += ', ' + validationErrorArray[i].message;
            } else {
              message += validationErrorArray[i].message;
            }
          }
        }
      } else {
        message = error.message;
      }
      return message;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
  Get user roles
  userId : UUID
  */
  async getUserRoles(userId) {
    try {
      const userRolesDetails = await userRolesModel
        .findAll({
          attributes: [],
          where: { userId: userId },
          include: [
            {
              model: rolesModel,
              attributes: ['type'],
            },
          ],
          raw: true,
        })
        .catch((error) => {
          throw new Error(error.message);
        });
      if (IsNotNullOrEmpty(userRolesDetails)) {
        return userRolesDetails;
      } else {
        throw new Error(userRolesMessages.userRolesNotFound);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
  Check user roles
  userRolesDetails : array
  roleType : string
  */
  async checkUserRole(userId, checkRolesArray) {
    try {
      const userRolesDetails = await this.getUserRoles(userId);
      return userRolesDetails.some((item) =>
        checkRolesArray.includes(item['role.type'])
      );
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
  Roles array
  userId : UUID
  */
  async getUserRolesArray(userId) {
    try {
      const userRolesDetails = await this.getUserRoles(userId);
      return userRolesDetails.map((item) => item['role.type']);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
 Exercise returning 
 */
  async getExerciseReturningAttributes() {
    try {
      return [
        ['id', 'exerciseId'],
        ['name', 'exerciseName'],
        'exerciseWeightage',
        'activated',
        'deleted',
      ];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
 Check Exercise Deleted Condition
 */
  async checkExerciseDeletedCondition(exerciseId) {
    try {
      const exerciseDetails = await this.getModuleDetails(
        exercisesModel,
        'findOne',
        { id: exerciseId, activated: true, deleted: false },
        ['id'],
        true
      );
      if (IsNotNullOrEmpty(exerciseDetails.id)) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
  Update exercise
  exerciseId : UUID
  updateObject : object
  t : transaction
  */
  async updateExercise(exerciseId, updateObject, t) {
    try {
      await exercisesModel
        .update(updateObject, { where: { id: exerciseId } }, { transaction: t })
        .catch(async (error) => {
          let message = await globalController.getMessageFromErrorInstance(
            error
          );
          if (message) {
            throw new Error(message);
          } else {
            throw new Error(error.message);
          }
        });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
  Update question
  exerciseId : UUID
  updateObject : object
  t : transaction
  */
  async updateQuestion(questionId, updateObject, t) {
    try {
      await questionsModel
        .update(updateObject, { where: { id: questionId } }, { transaction: t })
        .catch(async (error) => {
          let message = await globalController.getMessageFromErrorInstance(
            error
          );
          if (message) {
            throw new Error(message);
          } else {
            throw new Error(error.message);
          }
        });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
  Create result
   */

  async createOrUpdateUserExerciseResult(
    userObtainedMarks,
    quizExerciseId,
    loggedInUserId,
  ) {
    let returnState = false;
    try {
      const resultsDetails = await this.getModuleDetails(
        resultsModel,
        'findOne',
        { exerciseId: quizExerciseId, userId: loggedInUserId },
        ['id'],
        true
      );
      await db.sequelize.transaction(
        {
          deferrable: Sequelize.Deferrable.SET_DEFERRED,
        },
        async (t1) => {
          if (IsNotNullOrEmpty(resultsDetails.id)) {
           await resultsModel
              .update(
                {
                  obtainedMarks: userObtainedMarks,
                },{
                  where : {
                    exerciseId: quizExerciseId,
                    userId: loggedInUserId,
                  },
                },
                { transaction: t1 }
              )
              .then((updatedUserExerciseResult) => {
                console.log('updatedUserExerciseResult',updatedUserExerciseResult)
                returnState = true;
              })
              .catch(async (error) => {
                let message = await this.getMessageFromErrorInstance(error);
                if (message) {
                  throw new Error(message);
                } else {
                  throw new Error(error.message);
                }
              });
          } else {
           await resultsModel
              .create(
                {
                  obtainedMarks: userObtainedMarks,
                  exerciseId: quizExerciseId,
                  userId: loggedInUserId,
                },
                { transaction: t1 }
              )
              .then((newExerciseResult) => {
                console.log('newExerciseResult',newExerciseResult)

                if (newExerciseResult.id) {
                  returnState = true;
                } else {
                  throw new Error(resultsMessages.resultCreateFail);
                }
              })
              .catch(async (error) => {
                let message = await this.getMessageFromErrorInstance(error);
                if (message) {
                  throw new Error(message);
                } else {
                  throw new Error(error.message);
                }
              });
          }
        });
     return returnState;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async checkExerciseActivateTrueCondition(exerciseId, weightage){
    try {
      const questionDetails = await this.getModuleDetails(questionsModel,'findAll',{exerciseId: exerciseId, activated:true, deleted:false},['id'],true);
      if(IsNullOrEmpty(questionDetails)){
        throw new Error(questionsMessages.addQuestionsToExercise);
      }else{
        if(weightage=="0"){
          throw new Error(questionsMessages.addWeightageToExercise);
        }else{
          return true;
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },


  /*
  * Find exercise total marks
  */
async findExerciseTotalMarks(exerciseId){
try {
  const sum = await questionsModel.findAll({
    attributes: [
      'exerciseId',
      [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('marks'), 'INTEGER')), 'total_marks'],
    ],
    where: { exerciseId: exerciseId },
    group: ['exerciseId'],
    raw: true,
  });
  return IsNotNullOrEmpty(sum[0].total_marks) ? sum[0].total_marks : 0;
} catch (error) {
  throw new Error(error.message);
}
 },

  /*
   Update exercise total marks 
  */
   async updateExerciseTotalMarks(exerciseId){
    try {
      const exerciseTotalMarks = await this.findExerciseTotalMarks(exerciseId);
      await db.sequelize.transaction(
        {
          deferrable: Sequelize.Deferrable.SET_DEFERRED,
        },
        async (t1) => {
          await exercisesModel.update({totalMarks:exerciseTotalMarks}, {transaction:t1}).catch((error)=>{
            throw new Error(error.message);
          });
        });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
   }
};
