const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Role = sequelize.define("Role", {
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
});

Role.afterSync(async () => {
  try {
    const count = await Role.count();
    if (count === 0) {
      const initialRoleData = [{ name: "Administrator" }, { name: "Normal" }];

      await Role.bulkCreate(initialRoleData);
      console.log("Datos iniciales insertados en la tabla de roles");
    } else {
      console.log(
        "Los datos ya existen en la tabla de roles, se omite la inserción de datos iniciales"
      );
    }
  } catch (error) {
    console.error("Error al insertar datos iniciales:", error);
  }
});

module.exports = Role;
