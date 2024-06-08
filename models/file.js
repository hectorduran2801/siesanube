const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const File = sequelize.define("File", {
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
  file: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});



module.exports = File;
