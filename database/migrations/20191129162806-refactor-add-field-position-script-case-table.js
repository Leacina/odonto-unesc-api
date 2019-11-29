'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const queue = [
      queryInterface.addColumn('Script_Case', 'position', {
        allowNull: false,
        type: Sequelize.INTEGER,
      })
    ];

    return Promise.all(queue);
  },

  down: (queryInterface) => {
    const queue = [
      queryInterface.removeColumn('Script_Case', 'position')
    ];

    return Promise.all(queue);
  }
};