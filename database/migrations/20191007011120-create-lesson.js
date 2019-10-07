'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    /*
      Criação da tabela Lesson para cadastro de aulas.
    */
    return queryInterface.createTable('Lesson', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      expiration_date: {
        allowNull: false,
        type: DataTypes.DATE
      },
      start_date: {
        allowNull: false,
        type: DataTypes.DATE
      },
      id_teacher:{
        allowNull:false,
        type:DataTypes.INTEGER,
        references: {         
          model: 'Teacher',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface) => {
    /*
      Drop da tabela Lesson para retornar ao inicio.
    */
    return queryInterface.dropTable('Lesson');
  }
};
