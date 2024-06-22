const express = require("express");
const router = express.Router();
const FolderController = require("../controllers/folderController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMore = require("../middleware/uploadMiddlewareMore");

// Agregar Folder
router.post(
  "/addFolder",
  uploadMore.array("files"),
  FolderController.addFolder
);

// Obtener todos los folders
router.get("/getAllFolders", FolderController.getAllFolders);

// Eliminar Folder
router.delete("/deleteFolder/:id", FolderController.deleteFolder);

//Obtener url del archivo
router.get("/getURLFile/:name", FolderController.getURLFileDetailsByName);

//Obtener archivo
router.get("/getFilesByFolder/:id", FolderController.getFileDetailsById);

module.exports = router;
