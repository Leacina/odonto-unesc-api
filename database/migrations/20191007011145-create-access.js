'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    /*
      Criação da tabela Access para cadastro de acessos.
    */
    return queryInterface.createTable('Access', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      access_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      id_student:{
        allowNull:false,
        type:DataTypes.INTEGER,
        references: {         
          model: 'Student',
          key: 'id'
        }
      },
      id_lesson:{
        allowNull:false,
        type:DataTypes.INTEGER,
        references: {         
          model: 'Lesson',
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
      Drop da tabela Access para retornar ao inicio.
    */
    return queryInterface.dropTable('Access');
  }
};
