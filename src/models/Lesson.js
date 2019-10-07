module.exports = (sequelize, DataTypes) => {

    //Constanto responsavel por manipular os dados do banco de dados
    const Lesson = sequelize.define('Lesson', {
        name: DataTypes.STRING,
        code: DataTypes.STRING,
        expiration_date: DataTypes.DATE,
        start_date: DataTypes.DATE,
        id_teacher: DataTypes.INTEGER,
    });

    return Lesson
}