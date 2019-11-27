'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Script', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      shared: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      teacher: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Teacher',
          key: 'id'
        }
      },
      cases: {
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

  down: (queryInterface) => {
    return queryInterface.dropTable('Script');
  }
};
