'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    static associate(models) {
      Roles.hasMany(models.user_roles, { foreignKey: 'roleId' });
    }
  }
  Roles.init(
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
      type: {
        type: DataTypes.ENUM('admin', 'moderator', 'user'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'roles',
      indexes: [
        {
          unique: true,
          name: 'roles_unique_index',
          fields: ['type'],
        },
        {
          fields: ['id'],
          using: 'BTREE',
          name: 'roles_id_btree_index',
        },
        {
          fields: ['name'],
          using: 'BTREE',
          name: 'roles_name_btree_index',
        },
        {
          fields: ['type'],
          using: 'BTREE',
          name: 'roles_type_btree_index',
        },
      ],
    }
  );
  return Roles;
};
