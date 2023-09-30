'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Results extends Model {
    static associate(models) {
      Results.belongsTo(models.exercises);
      Results.belongsTo(models.users);
    }
  }
  Results.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
      },
      obtainedMarks: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'results',
      indexes: [
        {
          fields: ['id'],
          using: 'BTREE',
          name: 'results_id_btree_index',
        },
        {
          fields: ['obtainedMarks'],
          using: 'BTREE',
          name: 'results_obtainedMarks_btree_index',
        },
      ],
    }
  );
  return Results;
};
