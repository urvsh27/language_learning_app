'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Questions extends Model {
    static associate(models) {
      Questions.belongsTo(models.exercises);
    }
  }
  Questions.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marks: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'questions',
      indexes: [
        {
          fields: ['id'],
          using: 'BTREE',
          name: 'questions_id_btree_index',
        },
        {
          fields: ['question'],
          using: 'BTREE',
          name: 'questions_question_btree_index',
        },
        {
          fields: ['correctAnswer'],
          using: 'BTREE',
          name: 'questions_correctAnswer_btree_index',
        },
        {
          fields: ['marks'],
          using: 'BTREE',
          name: 'questions_marks_btree_index',
        },
        {
          fields: ['activated'],
          using: 'BTREE',
          name: 'questions_activated_btree_index',
        },
        {
          fields: ['deleted'],
          using: 'BTREE',
          name: 'questions_deleted_btree_index',
        },
      ],
    }
  );
  return Questions;
};
