'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPreferences extends Model {
    static associate(models) {
        UserPreferences.belongsTo(models.users);
        UserPreferences.belongsTo(models.languages);
    }
  }
  UserPreferences.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'user_preferences',
      indexes: [
        {
          fields: ['id'],
          using: 'BTREE',
          name: 'user_preferences_id_btree_index',
        },
      ],
    }
  );
  return UserPreferences;
};
