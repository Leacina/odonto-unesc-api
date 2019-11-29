module.exports = (sequelize, DataTypes) => {
    const Script_Case = sequelize.define('Script_Case', {
        id_script: DataTypes.INTEGER,
        id_case: DataTypes.INTEGER,
        position: DataTypes.INTEGER,
    }, {
        //Adicionado para gerar a tabela no singular
        freezeTableName: true,
    });

    return Script_Case;
}