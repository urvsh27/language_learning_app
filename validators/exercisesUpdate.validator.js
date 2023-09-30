const Joi = require('joi');
const name =Joi.string().disallow("''", '""').label('Name');
const activated = Joi.boolean().valid(true, false).label('Activated');
const deleted = Joi.boolean().valid(true, false).label('Deleted');
const exerciseWeightage =  Joi.number().integer().max(100).label('Exercise weightage');

const exercisesUpdateSchema = Joi.object({
    name,
    activated,
    deleted,
    exerciseWeightage
});

module.exports = exercisesUpdateSchema;
