'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    /*
      Criação da tabela Lesson-Case para vincular as aulas aos casos.
    */
    return queryInterface.createTable('Lesson-Case', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_case:{
        allowNull:false,
        type:DataTypes.INTEGER,
        references: {         
          model: 'Case',
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
      Drop da tabela Lesson-Case para retornar ao inicio.
    */
    return queryInterface.dropTable('Lesson-Case');
  }
};
