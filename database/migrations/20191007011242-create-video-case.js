'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    /*
      Criação da tabela Video-Case para vincular os videos e casos.
    */
    return queryInterface.createTable('Video_Case', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_video:{
        allowNull:false,
        type:DataTypes.INTEGER,
        references: {         
          model: 'Video',
          key: 'id'
        }
      },
      id_case:{
        allowNull:false,
        type:DataTypes.INTEGER,
        references: {         
          model: 'Case',
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
      Drop da tabela Video-Case para retornar ao inicio.
    */
    return queryInterface.dropTable('Video-Case');
  }
};
