'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Exercises extends Model {
    static associate(models) {
      Exercises.belongsTo(models.languages);
      Exercises.hasMany(models.questions, { foreignKey: 'exerciseId' });
      Exercises.hasMany(models.results, { foreignKey: 'exerciseId' });
    }
  }
  Exercises.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalMarks : {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue : "0"
      },
      exerciseWeightage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue : "0"
      },
      activated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'exercises',
      indexes: [
        {
          fields: ['id'],
          using: 'BTREE',
          name: 'exercises_id_btree_index',
        },
        {
          fields: ['name'],
          using: 'BTREE',
          name: 'exercises_name_btree_index',
        },
        {
          fields: ['exerciseWeightage'],
          using: 'BTREE',
          name: 'exercises_exerciseWeightage_btree_index',
        },
        {
          fields: ['activated'],
          using: 'BTREE',
          name: 'exercises_activated_btree_index',
        },
        {
          fields: ['deleted'],
          using: 'BTREE',
          name: 'exercises_deleted_btree_index',
        },
      ],
    }
  );
  return Exercises;
};
