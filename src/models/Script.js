module.exports = (sequelize, DataTypes) => {
    const Script = sequelize.define('Script', {
        title: DataTypes.STRING,
        description: DataTypes.INTEGER,
        shared: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        teacher: DataTypes.INTEGER
    }, {
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Script
}