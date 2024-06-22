const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Folder = sequelize.define("Folder", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "El campo 'nombre' no puede ser nulo",
      },
      notEmpty: {
        msg: "El campo 'nombre' no puede estar vacío",
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  files: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

module.exports = Folder;
