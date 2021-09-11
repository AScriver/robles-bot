module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define('History', {
        historyID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tableName: {
            type: DataTypes.STRING
        },
        columnName: {
            type: DataTypes.STRING
        },
        oldvalue: {
            type: DataTypes.STRING
        },
        newValue: {
            type: DataTypes.STRING
        }
    });

    return History;
};
