const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  /*  uid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true,
  }, */
  firstname: {
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
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "El campo 'apellido' no puede ser nulo",
      },
      notEmpty: {
        msg: "El campo 'apellido' no puede estar vacío",
      },
    },
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "El campo 'contraseña' no puede ser nulo",
      },
      notEmpty: {
        msg: "El campo 'contraseña' no puede estar vacío",
      },
    },
  },
  authToken: {
    type: DataTypes.STRING,
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
});

module.exports = User;
