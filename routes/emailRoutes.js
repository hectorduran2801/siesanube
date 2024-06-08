const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");

// Obtener todos las emials adjuntados
router.get("/getAllEmails", emailController.getAllEmails);

// Obtener todos las emails link
router.get("/getAllEmailLink", emailController.getAllEmailLink);

module.exports = router;
