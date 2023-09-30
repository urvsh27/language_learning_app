// Import models
const languagesModel = require('../models').languages;
//Import controllers
const globalController = require('./globalController');

//Import files
const {
  successArrayResponse,
  errorArrayResponse,
} = require('../utils/response');
const {  IsNotNullOrEmpty } = require('../utils/enum');
const {
  languagesMessages,
} = require('../utils/messages');

module.exports = {
  /*
 Get All languages
 */
  async getAllLanguages(req, res) {
    let successArrRes = successArrayResponse;
    let errorArrRes = errorArrayResponse;
    try {
      const languages = await globalController.getModuleDetails(
        languagesModel,
        'findAll',
        { activated : true, deleted : false},
        [['id','languageId'],['name','languageName']],
        true
      );
      if(IsNotNullOrEmpty(languages)){
        successArrRes.message = languagesMessages.languagesFound;
        successArrRes.data = languages;
      }else{
        throw new Error(languagesMessages.languagesNotFound)
      }
      res.status(201).send(successArrRes);
    } catch (error) {
      errorArrRes.message = error.message;
      res.status(400).send(errorArrRes);
    }
  },
};
