'use strict';
const uuid = require('uuid');

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
    const languagesQuery = await queryInterface.sequelize.query(`
    SELECT * FROM languages;
  `);
    const existingLanguages = languagesQuery[0].map((row) => row.name);
    const languagesToInsert = [
      {
        id: uuid.v4(),
        name: 'English',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Hindi',
      },
      {
        id: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Gujarati',
      },
      {
        id: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'German',
      },
      {
        id: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Chinese',
      },
      {
        id: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Punjabi',
      },
      {
        id: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Japanese',
      },
      {
        id: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Portuguese',
      },
    ];
    if (!existingLanguages.length > 0) {
      for (let i = 0; i < languagesToInsert.length; i++) {
        if (!existingLanguages.includes(languagesToInsert[i].name)) {
          await queryInterface.bulkInsert(
            'languages',
            [languagesToInsert[i]],
            {}
          );
        }
      }
    }

    return true;
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
