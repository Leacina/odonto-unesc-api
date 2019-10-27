module.exports = (sequelize, DataTypes) => {

    //Constanto responsavel por manipular os dados do banco de dados
    const Video = sequelize.define('Video', {
        url: DataTypes.STRING,
        is_active: DataTypes.BOOLEAN,
    },{
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Video
}