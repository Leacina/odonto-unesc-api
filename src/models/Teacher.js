module.exports = (sequelize, DataTypes) => {

    //Constanto responsavel por manipular os dados do banco de dados
    const Teacher = sequelize.define('Teacher', {
        name: DataTypes.STRING,
        code: DataTypes.INTEGER,
        password: DataTypes.STRING,
    });

    return Teacher
}