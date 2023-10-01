'use strict';

const { IsNotNullOrEmpty, IsNullOrEmpty } = require('../utils/enum');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const rolesQuery = await queryInterface.sequelize.query(`
    SELECT id FROM roles where type = 'admin';
  `);
    const adminUser = {
      id: uuid.v4(),
      name: 'Main administrator',
      email: 'admin@gmail.com',
      password: 'Admin@1234',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const checkAdmin = await queryInterface.sequelize.query(
      `SELECT id FROM users where email = :adminEmail;`,
      {
        replacements: { adminEmail: adminUser.email },
      }
    );
    if (IsNullOrEmpty(checkAdmin[0])) {
      adminUser.password = await bcrypt.hash(adminUser.password, 10);
      await queryInterface.bulkInsert('users', [adminUser], {});
      const usersQuery = await queryInterface.sequelize.query(
        `SELECT id FROM users where email = :adminEmail;`,
        {
          replacements: { adminEmail: adminUser.email },
        }
      );
      if (IsNotNullOrEmpty(usersQuery)) {
        await queryInterface.bulkInsert(
          'user_roles',
          [
            {
              id: uuid.v4(),
              userId: usersQuery[0][0].id,
              roleId: rolesQuery[0][0].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
