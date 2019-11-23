'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Cria novos campos title, description, archive, active, shared e teacher
    */
    const queue = [
      queryInterface.removeColumn('Case', 'id_teacher'),
      queryInterface.removeColumn('Case', 'name'),
      queryInterface.addColumn('Case', 'title', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('Case', 'active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }),
      queryInterface.addColumn('Case', 'shared', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }),
      queryInterface.addColumn('Case', 'teacher', {
        allowNull:false,
        type:Sequelize.INTEGER,
        references: {        
          model: 'Teacher',
          key: 'id'
        }
      })
    ];

    return Promise.all(queue);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Remove campos
    */
    const queue = [
      queryInterface.addColumn('Case', 'id_teacher', {
        allowNull:false,
        type:Sequelize.INTEGER,
        references: {        
          model: 'Teacher',
          key: 'id'
        }
      }),
      queryInterface.addColumn('Case', 'name', {
        allowNull: false,
        type: Sequelize.STRING,
      }),
      queryInterface.removeColumn('Case', 'title'),
      queryInterface.removeColumn('Case', 'active'),
      queryInterface.removeColumn('Case', 'shared'),
      queryInterface.removeColumn('Case', 'teacher'),
    ];

    return Promise.all(queue);
  }
};
