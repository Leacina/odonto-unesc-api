module.exports = (sequelize, DataTypes) => {

    //Constanto responsavel por manipular os dados do banco de dados
    const Case = sequelize.define('Case', {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        teacher: DataTypes.INTEGER,
    },{
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Case
}