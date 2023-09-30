'use strict';
const uuid = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
    SELECT * FROM roles;
  `);
  const existingRoles = rolesQuery[0].map((row) => row.type);
  
  const rolesToInsert = [
    {
      id: uuid.v4(),
      name: 'Admin',
      type: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuid.v4(),
      name: 'User',
      type: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuid.v4(),
      name: 'Moderator',
      type: 'moderator',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  if(!existingRoles.length>0) {
    for (let i = 0; i < rolesToInsert.length; i++) {
      if(!existingRoles.includes(rolesToInsert[i].type)){
        await queryInterface.bulkInsert('roles',[rolesToInsert[i]] , {});
      }    
    }
  }
  

  return true;
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
