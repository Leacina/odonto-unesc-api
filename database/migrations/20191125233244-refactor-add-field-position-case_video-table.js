'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Cria novos campos title, description, archive, active, shared e teacher
    */
    /*
      Remove campos
    */
    const queue = [
      queryInterface.addColumn('Video_Case', 'position', {
        allowNull:false,
        type:Sequelize.INTEGER,
      })
    ];

    return Promise.all(queue);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Remove campos
    */
    const queue = [
      queryInterface.removeColumn('Video_Case', 'position')
    ];

    return Promise.all(queue);
  }
};
