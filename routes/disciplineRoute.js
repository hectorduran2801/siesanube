const express = require("express");
const router = express.Router();
const disciplineController = require("../controllers/disciplineController");
const authMiddleware = require("../middleware/authMiddleware");

// Obtener todos las disciplinas
router.get("/getAllDisciplines", disciplineController.getAllDisciplines);

module.exports = router;
