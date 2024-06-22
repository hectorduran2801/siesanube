const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserFile = sequelize.define("UserFile", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = UserFile;
