module.exports = (sequelize, DataTypes) => {

    //Constanto responsavel por manipular os dados do banco de dados
    const Teacher = sequelize.define('Teacher', {
        name: DataTypes.STRING,
        code: DataTypes.INTEGER,
        email: DataTypes.STRING,
        manager: DataTypes.BOOLEAN,
        password: DataTypes.STRING,
        active: DataTypes.BOOLEAN
    },{
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Teacher
}