'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Cria novos campos title, description, archive, active, shared e teacher
    */
    const queue = [
      queryInterface.removeColumn('Video', 'url'),
      queryInterface.removeColumn('Video', 'is_active'),
      queryInterface.addColumn('Video', 'title', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('Video', 'description', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('Video', 'archive', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('Video', 'active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }),
      queryInterface.addColumn('Video', 'shared', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }),
      queryInterface.addColumn('Video', 'teacher', {
        type: Sequelize.INTEGER,
        allowNull: false
      })
    ];

    return Promise.all(queue);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Remove campos
    */
    const queue = [
      queryInterface.addColumn('Video', 'url', {
        allowNull: false,
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Video', 'is_active', {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      }),
      queryInterface.removeColumn('Video', 'title'),
      queryInterface.removeColumn('Video', 'description'),
      queryInterface.removeColumn('Video', 'archive'),
      queryInterface.removeColumn('Video', 'active'),
      queryInterface.removeColumn('Video', 'shared'),
      queryInterface.removeColumn('Video', 'teacher'),
    ];

    return Promise.all(queue);
  }
};
