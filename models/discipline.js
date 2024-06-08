const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Discipline = sequelize.define("Discipline", {
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

Discipline.afterSync(async () => {
  try {
    const count = await Discipline.count();
    if (count === 0) {
      const initialDisciplineData = [
        { name: "Electricity" },
        { name: "Mechanics" },
      ];

      await Discipline.bulkCreate(initialDisciplineData);
      console.log("Datos iniciales insertados en la tabla de Disciplina");
    } else {
      console.log(
        "Los datos ya existen en la tabla de Disciplina, se omite la inserción de datos iniciales"
      );
    }
  } catch (error) {
    console.error("Error al insertar datos iniciales:", error);
  }
});

module.exports = Discipline;
