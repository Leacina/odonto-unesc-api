module.exports = (sequelize, DataTypes) => {

    //Constanto responsavel por manipular os dados do banco de dados
    const Case = sequelize.define('Case', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        id_teacher: DataTypes.INTEGER,
    },{
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Case
}