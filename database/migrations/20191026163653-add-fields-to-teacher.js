'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Cria novos campos email, manager e active para professores
    */
    const queue = [
      queryInterface.addColumn('Teacher', 'email', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('Teacher', 'manager', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }),
      queryInterface.addColumn('Teacher', 'active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      })
    ];

    return Promise.all(queue);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Remove campos
    */
    const queue = [
      queryInterface.removeColumn('Teacher', 'email'),
      queryInterface.removeColumn('Teacher', 'manager'),
      queryInterface.removeColumn('Teacher', 'active')
    ];

    return Promise.all(queue);
  }
};
