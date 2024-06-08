const disciplineService = require("../services/disciplineService");

/* GET -> http://localhost:8081/api/v1/disciplines/getAllDisciplines ->
 */
const getAllDisciplines = async (req, res) => {
  try {
    const disciplines = await disciplineService.getAllDisciplines();
    res.status(200).json(disciplines);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllDisciplines };
