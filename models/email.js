const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Email = sequelize.define("Email", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "El campo 'email' no puede ser nulo",
      },
      notEmpty: {
        msg: "El campo 'email' no puede estar vacío",
      },
    },
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Email;
