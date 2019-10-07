module.exports = (sequelize, DataTypes) => {

    //Constanto responsavel por manipular os dados do banco de dados
    const Student = sequelize.define('Student', {
        name: DataTypes.STRING,
        code: DataTypes.INTEGER,
        id_teacher: DataTypes.INTEGER,
    });

    return Student
}