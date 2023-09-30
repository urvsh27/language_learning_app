'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    static associate(models) {
        UserRoles.belongsTo(models.users);
        UserRoles.belongsTo(models.roles);
    }
  }
  UserRoles.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
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
      modelName: 'user_roles',
      indexes: [
        {
          fields: ['id'],
          using: 'BTREE',
          name: 'user_roles_id_btree_index',
        },
        {
          fields: ['activated'],
          using: 'BTREE',
          name: 'user_roles_activated_btree_index',
        },
        {
          fields: ['deleted'],
          using: 'BTREE',
          name: 'user_roles_deleted_btree_index',
        },
      ],
    }
  );
  return UserRoles;
};
