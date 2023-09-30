'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Languages extends Model {
    static associate(models) {
      Languages.hasMany(models.exercises, { foreignKey: 'languageId' });
      Languages.hasMany(models.user_preferences, { foreignKey: 'languageId' });
    }
  }
  Languages.init(
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
        unique : true,
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
      modelName: 'languages',
      indexes: [
        {
          fields: ['id'],
          using: 'BTREE',
          name: 'languages_id_btree_index',
        },
        {
          fields: ['name'],
          using: 'BTREE',
          name: 'languages_name_btree_index',
        },
        {
          fields: ['activated'],
          using: 'BTREE',
          name: 'languages_activated_btree_index',
        },
        {
          fields: ['deleted'],
          using: 'BTREE',
          name: 'languages_deleted_btree_index',
        },
      ],
    }
  );
  return Languages;
};
