module.exports = (sequelize, DataTypes) => {

    //Constanto responsavel por manipular os dados do banco de dados
    const Video = sequelize.define('Video', {
        name: DataTypes.STRING,
        url: DataTypes.STRING,
        is_active: DataTypes.BOOLEAN,
    },{
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Video
}