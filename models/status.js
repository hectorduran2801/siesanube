const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Status = sequelize.define("Status", {
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

Status.afterSync(async () => {
  try {
    const count = await Status.count();
    if (count === 0) {
      const initialStatusData = [{ name: "Active" }, { name: "Disabled" }];

      await Status.bulkCreate(initialStatusData);
      console.log("Datos iniciales insertados en la tabla de Estado");
    } else {
      console.log(
        "Los datos ya existen en la tabla de Estado, se omite la inserción de datos iniciales"
      );
    }
  } catch (error) {
    console.error("Error al insertar datos iniciales:", error);
  }
});

module.exports = Status;
