'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const queue = [
      queryInterface.removeColumn('Script', 'cases')
    ];

    return Promise.all(queue);
  },

  down: (queryInterface, Sequelize) => {
    const queue = [
      queryInterface.addColumn('Script', 'cases', {
        allowNull: true,
        type: Sequelize.INTEGER,
      })
    ];

    return Promise.all(queue);
  }
};
