const Discipline = require("../models/discipline");

const DisciplineService = {
  async getAllDisciplines() {
    try {
      const disciplines = await Discipline.findAll({
        order: [["id", "ASC"]],
      });
      return disciplines;
    } catch (error) {
      throw new Error("Error al obtener disciplinas: " + error.message);
    }
  },
};

module.exports = DisciplineService;
