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
  successObjectResponse,
  errorObjectResponse,
  successArrayResponse,
  errorArrayResponse,
} = require('../utils/response');
const { IsNullOrEmpty, IsNotNullOrEmpty } = require('../utils/enum');
const {
  getHashedPassword,
  compareHashedPassword,
  createJwtToken,
} = require('../middlewares/auth');
const {
  userMessages,
  roleMessages,
  generalMessages,
  userRolesMessages,
  languagesMessages,
  userPreferenceMessages,
} = require('../utils/messages');
const Sequelize = require('sequelize');
const db = require('../models/index');
const { Op } = require('sequelize');

module.exports = {
  /*
   * Register
   * name : string
   * email : email
   * password : string
   */
  async register(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      const { name, email, password } = req.body;
      let newUserId = '';
      await db.sequelize.transaction(
        {
          deferrable: Sequelize.Deferrable.SET_DEFERRED,
        },
        async (t1) => {
          const existingUserDetails = await globalController.getModuleDetails(
            usersModel,
            'findOne',
            { email: email },
            ['id', 'name', 'email'],
            true
          );
          if (IsNotNullOrEmpty(existingUserDetails.id)) {
            throw new Error(userMessages.userAlreadyExists);
          } else {
            const hashedPassword = await getHashedPassword(password);
            await usersModel
              .create(
                { name, email, password: hashedPassword },
                { transaction: t1 }
              )
              .then(async (newUserDetails) => {
                if (IsNotNullOrEmpty(newUserDetails.id)) {
                  // Find all roles
                  const roles = await globalController.getModuleDetails(
                    rolesModel,
                    'findOne',
                    { type: 'user' },
                    ['id'],
                    true
                  );
                  if (IsNotNullOrEmpty(roles)) {
                    // Add user roles
                    await userRolesModel
                      .create(
                        {
                          roleId: roles.id,
                          userId: newUserDetails.id,
                        },
                        { transaction: t1 }
                      )
                      .then(() => {
                        newUserId = newUserDetails.id;
                      })
                      .catch(async (error) => {
                        let message =
                          await globalController.getMessageFromErrorInstance(
                            error
                          );
                        if (message) {
                          throw new Error(message);
                        } else {
                          throw new Error(error.message);
                        }
                      });
                  } else {
                    throw new Error(roleMessages.rolesNotFound);
                  }
                } else {
                  throw new Error(userMessages.userRegisterFail);
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
        }
      );
      successObjectRes.message = userMessages.userRegisterSuccess;
      successObjectRes.data = await globalController.getModuleDetails(
        usersModel,
        'findOne',
        { id: newUserId },
        ['id', 'name', 'email'],
        true
      );
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },

  /*
   * Login
   * email : email
   * password : string
   */
  async login(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      const { email, password } = req.body;
      const userDetails = await globalController.getModuleDetails(
        usersModel,
        'findOne',
        { email: email },
        [['id', 'userId'], 'name', 'email', 'password'],
        true
      );
      if (IsNullOrEmpty(userDetails.userId)) {
        throw new Error(userMessages.userNotFound);
      } else {
        const matchPassword = await compareHashedPassword(
          password,
          userDetails.password
        );
        if (matchPassword === true) {
          const token = await createJwtToken(userDetails.userId);
          delete userDetails.password;
          const checkUserRole = await globalController.checkUserRole(
            userDetails.userId,
            ['user']
          );
          const userRolesDetails = await globalController.getUserRolesArray(
            userDetails.userId
          );
          if (checkUserRole) {
            successObjectRes.message = userMessages.userLoginSuccess;
            successObjectRes.data = {
              accessToken: token,
              userDetails: userDetails,
              userRoles: userRolesDetails,
            };
          } else {
            throw new Error(userRolesMessages.noUserAccess);
          }
        } else {
          throw new Error(userMessages.userLoginFailure);
        }
      }
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },

  /*
   * Admin login
   * email : email
   * password : string
   */
  async adminLogin(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      const { email, password } = req.body;
      const userDetails = await globalController.getModuleDetails(
        usersModel,
        'findOne',
        { email: email },
        [['id', 'userId'], 'name', 'email', 'password'],
        true
      );
      if (IsNullOrEmpty(userDetails.userId)) {
        throw new Error(userMessages.userNotFound);
      } else {
        const matchPassword = await compareHashedPassword(
          password,
          userDetails.password
        );
        if (matchPassword === true) {
          const checkUserRole = await globalController.checkUserRole(
            userDetails.userId,
            ['admin']
          );
          if (checkUserRole) {
            const token = await createJwtToken(userDetails.userId);
            delete userDetails.password;
            const userRolesDetails = await globalController.getUserRolesArray(
              userDetails.userId
            );
            successObjectRes.message = userMessages.userLoginSuccess;
            successObjectRes.data = {
              accessToken: token,
              userDetails: userDetails,
              userRoles: userRolesDetails,
            };
          } else {
            throw new Error(userRolesMessages.noAdminAccess);
          }
        } else {
          throw new Error(userMessages.userLoginFailure);
        }
      }
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },

  /*
   Dashboard
  */
  async dashboard(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      successObjectRes.message = generalMessages.welcomeMessage;
      successObjectRes.data = {};
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },

  /*
   Dashboard
  */
  async getAllUsers(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      const usersDetails = await globalController.getModuleDetails(
        usersModel,
        'findAll',
        {
          email: {
            [Op.not]: 'admin@gmail.com',
          },
        },
        [
          ['id', 'userId'],
          ['name', 'userName'],
          ['email', 'userEmail'],
          'activated'
        ],
        true
      );
      successArrRes.message = userMessages.usersListFound;
      successArrRes.data = usersDetails;
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },

  /*
   User preferences
  */
  async getUserPreferences(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      const userId = req.headers.loggedInUserId;
      let userPreferences = [];
      await languagesModel
        .findAll({
          attributes: ['id', 'name'],
          where: { activated: true, deleted: false },
          include:[{
            model: userPreferencesModel,
            attributes: ['id'],
            where: { userId: userId },
            required: false,
          },],
          raw: false,
        })
        .then((userPreferencesResponse) => {
          userPreferences = userPreferencesResponse;
        })
        .catch((error) => {
          throw new Error(error.message);
        });
      userPreferences = userPreferences.map((item) => ({
        languageId: item.id,
        languageName: item.name,
        userPreferences: IsNotNullOrEmpty(item['user_preferences'])? true : false 
      }));
      successArrRes.message = languagesMessages.languagesFound;
      successArrRes.data = userPreferences;
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },

  /*
  Create preferences
  */
  async createPreference(req, res) {
    let successObjectRes = successObjectResponse;
    let errorObjectRes = errorObjectResponse;
    try {
      let newPreferenceId = '';
      const languageDetails = await globalController.getModuleDetails(
        languagesModel,
        'findOne',
        { id: req.body.languageId },
        ['id'],
        true
      );
      if (IsNotNullOrEmpty(languageDetails.id)) {
        const userPreferenceDetails = await globalController.getModuleDetails(
          userPreferencesModel,
          'findOne',
          { languageId: req.body.languageId, userId : req.headers.loggedInUserId },
          ['id'],
          true
        );
        if(IsNullOrEmpty(userPreferenceDetails.id)){
          await db.sequelize.transaction(
            {
              deferrable: Sequelize.Deferrable.SET_DEFERRED,
            },
            async (t1) => {
              await userPreferencesModel
                .create(
                  {
                    languageId: req.body.languageId,
                    userId: req.headers.loggedInUserId,
                  },
                  {
                    transaction: t1,
                  }
                )
                .then((newPreference) => {
                  if (IsNotNullOrEmpty(newPreference.id)) {
                    newPreferenceId = newPreference.id;
                  } else {
                    throw new Error(
                      userPreferenceMessages.userPreferenceCreateFail
                    );
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
        }else{
          throw new Error(userPreferenceMessages.userPreferenceAlreadyExists)
        }
      } else {
        throw new Error(languagesMessages.languageNotFound);
      }
      successObjectRes.message = userPreferenceMessages.userPreferenceCreateSuccess;
      successObjectRes.data = await globalController.getModuleDetails(
        userPreferencesModel,
        'findOne',
        { id: newPreferenceId },
        ['id'],
        true
      );
      res.status(201).send(successObjectRes);
    } catch (error) {
      errorObjectRes.message = error.message;
      res.status(400).send(errorObjectRes);
    }
  },
};
