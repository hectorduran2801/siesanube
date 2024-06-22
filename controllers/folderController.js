const folderService = require("../services/folderService");

/* 
POST -> https://api-siesa.in/api/v1/folders/addFolder -> 
{
  "name": "folder name",
  "description": "folder description",
  "files": ["detail1"],

}
*/

const addFolder = async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("Proporcione al menos un archivo para la carpeta.");
    }

    const result = await folderService.addFolder(name, description, req.files);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* GET -> https://api-siesa.in/api/v1/folders/getAllFolders ->
 */
const getAllFolders = async (req, res) => {
  try {
    const files = await folderService.getAllFolders();
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* DELETE -> https://api-siesa.in/api/v1/folders/deleteFolder/id ->
 */
const deleteFolder = async (req, res) => {
  const folderId = req.params.id;

  try {
    const result = await folderService.deleteFolder(folderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* GET -> https://api-siesa.in/api/v1/folders/getURLFile/:name */
const getURLFileDetailsByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Nombre del archivo no proporcionado." });
    }

    const fileDetails = await folderService.getURLFileDetailsByName(name);

    if (fileDetails) {
      return res.json(fileDetails);
    } else {
      return res
        .status(404)
        .json({ error: "Detalles del archivo no encontrados." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET -> https://api-siesa.in/api/v1/folders/getFilesByFolder/:id */
const getFileDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Id de la carpeta no proporcionado." });
    }

    const fileDetails = await folderService.getFilesDetailsById(id);

    if (fileDetails) {
      return res.json(fileDetails);
    } else {
      return res
        .status(404)
        .json({ error: "Detalles de la carpeta no encontrados." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addFolder,
  getAllFolders,
  deleteFolder,
  getURLFileDetailsByName,
  getFileDetailsById,
};
