module.exports = (sequelize, DataTypes) => {

    //Constante responsável por manipular os dados do banco de dados
    const Video_Case = sequelize.define('Video_Case', {
        id_video: DataTypes.INTEGER,
        id_case: DataTypes.INTEGER,
        position: DataTypes.INTEGER
    }, {
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Video_Case
}