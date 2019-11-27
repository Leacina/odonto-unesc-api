'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Criação da tabela Script-Case para vincular os casos e roteiros.
    */
    return queryInterface.createTable('Script_Case', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_script: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Script',
          key: 'id'
        }
      },
      id_case: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Case',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Drop da tabela Video-Case para retornar ao inicio.
    */
    return queryInterface.dropTable('Video-Case');
  }
};
