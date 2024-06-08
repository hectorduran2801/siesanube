const fileService = require("../services/fileService");

/* 
POST -> http://localhost:8081/api/v1/files/addFile -> 
{
  "name": "file name",
  "description": "file description",
  "file": ["detail1"],
	"DisciplineId": 1 o 2
}
*/
const addFile = async (req, res) => {
  const { name, description, DisciplineId } = req.body;
  const file = req.file;

  try {
    if (!file) {
      throw new Error("Proporcione al menos un archivo.");
    }

    const result = await fileService.addFile(
      name,
      description,
      file,
      DisciplineId
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* PUT -> http://localhost:8081/api/v1/files/updateFiles/id -> 
{
  "name": "file name",
  "description": "file description",
  "file": ["detail1"],
	"DisciplineId": 1 o 2
}
*/
const updateFile = async (req, res) => {
  const fileId = req.params.id;
  const updatedData = req.body;
  const file = req.file;

  try {
    const result = await fileService.updateFile(fileId, updatedData, file);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* DELETE -> http://localhost:8081/api/v1/files/deleteFiles/id ->
 */
const deleteFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const result = await fileService.deleteFile(fileId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* GET -> http://localhost:8081/api/v1/files/getAllFiles ->
 */
const getAllFiles = async (req, res) => {
  try {
    const files = await fileService.getAllFiles();
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* GET -> http://localhost:8081/api/v1/files/file-details/:id */
const getFileDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "ID del archivo no proporcionado." });
    }

    const fileDetails = await fileService.getFileDetailsById(id);

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

/* GET -> http://localhost:8081/api/v1/users/getURLFile/:id */
const getURLFileDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "ID del archivo no proporcionado." });
    }

    const fileDetails = await fileService.getURLFileDetailsById(id);

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

module.exports = {
  addFile,
  updateFile,
  deleteFile,
  getAllFiles,
  getFileDetailsById,
  getURLFileDetailsById
};
