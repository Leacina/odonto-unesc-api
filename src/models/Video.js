module.exports = (sequelize, DataTypes) => {

    //Constante responsável por manipular os dados do banco de dados
    const Video = sequelize.define('Video', {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        archive: DataTypes.STRING,
        shared: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        teacher: DataTypes.INTEGER
    }, {
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Video
}