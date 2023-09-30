// Import models
const usersModel = require('../models').users;
const rolesModel = require('../models').roles;
const userRolesModel = require('../models').user_roles;

// Import modules
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

// Import files
const { jwtSecretKey } = require('../appConfig');
const { IsNullOrEmpty, IsNotNullOrEmpty } = require('../utils/enum');
const { generalMessages, userRolesMessages } = require('../utils/messages');
const {
  successObjectResponse,
  errorObjectResponse,
} = require('../utils/response');
const { globalController } = require('../controllers');

module.exports = {
  /*
   * Hash the password
   */
  async getHashedPassword(password) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
   * Compare the hashed password
   */
  async compareHashedPassword(password, hashedPassword) {
    try {
      return bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
   * Create a jwt token
   */
  async createJwtToken(value) {
    try {
      const token = JWT.sign({ value }, jwtSecretKey, {
        expiresIn: '1d',
        algorithm: 'HS256',
      });
      return token;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
   * Jwt verify (function name kept as userAuthValidate to differentiate for admin or any other role validations)
   */
  // check single role
  //  userRolesDetails.some(item => item['role.type'] === 'user');
  // check multiple roles
  // userRolesDetails.some(item =>
  //   ['Admin', 'User'].includes(item['role.type'])
  // );
  async jwtUserAuthValidate(req, res, next) {
    let errorObjectRes = errorObjectResponse;
    try {
      if (IsNullOrEmpty(req.headers.authorization)) {
        throw new Error(generalMessages.jwtTokenRequired);
      } else {
        var decoded = {};
        decoded = JWT.verify(req.headers.authorization, jwtSecretKey);
        if (IsNotNullOrEmpty(decoded)) {
          const checkUserRole = await globalController.checkUserRole(decoded.value, ['user']);
          if(checkUserRole) {
            req.headers.loggedInUserId = decoded.value;
            next();
          }else{
            throw new Error(userRolesMessages.noAccess)
          }
        } else {
          throw new Error(generalMessages.unableToVerifyJwtToken);
        }
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        errorObjectRes.status = '5';
        errorObjectRes.message = generalMessages.jwtTokenExpired;
      } else {
        errorObjectRes.message = error.message;
      }
      res.status(400).send(errorObjectRes);
    }
  },

  async jwtAdminAuthValidate(req, res, next) {
    let errorObjectRes = errorObjectResponse;
    try {
      if (IsNullOrEmpty(req.headers.authorization)) {
        throw new Error(generalMessages.jwtTokenRequired);
      } else {
        var decoded = {};
        decoded = JWT.verify(req.headers.authorization, jwtSecretKey);
        if (IsNotNullOrEmpty(decoded)) {
          const checkUserRole = await globalController.checkUserRole(decoded.value, ['admin']);
          if(checkUserRole) {
            req.headers.loggedInUserId = decoded.value;
            next();
          }else{
            throw new Error(userRolesMessages.noAccess)
          }
        } else {
          throw new Error(generalMessages.unableToVerifyJwtToken);
        }
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        errorObjectRes.status = '5';
        errorObjectRes.message = generalMessages.jwtTokenExpired;
      } else {
        errorObjectRes.message = error.message;
      }
      res.status(400).send(errorObjectRes);
    }
  },

  async jwtUserOrAdminAuthValidate(req, res, next) {
    let errorObjectRes = errorObjectResponse;
    try {
      if (IsNullOrEmpty(req.headers.authorization)) {
        throw new Error(generalMessages.jwtTokenRequired);
      } else {
        var decoded = {};
        decoded = JWT.verify(req.headers.authorization, jwtSecretKey);
        if (IsNotNullOrEmpty(decoded)) {
            const checkUserRole = await globalController.checkUserRole(decoded.value, ['admin', 'user']);
            if(checkUserRole) {
              req.headers.loggedInUserId = decoded.value;
              next();
            }else{
              throw new Error(userRolesMessages.noAccess)
            }
        } else {
          throw new Error(generalMessages.unableToVerifyJwtToken);
        }
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        errorObjectRes.status = '5';
        errorObjectRes.message = generalMessages.jwtTokenExpired;
      } else {
        errorObjectRes.message = error.message;
      }
      res.status(400).send(errorObjectRes);
    }
  },
};
