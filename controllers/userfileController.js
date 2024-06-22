const UserFileService = require("../services/userfileService");

/* GET -> https://api-siesa.in/api/v1/usersfiles/getAll */
const getUsersAndFiles = async (req, res) => {
  try {
    const allUsersAndFiles = await UserFileService.getUsersAndFiles();
    res.status(200).json(allUsersAndFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET -> https://api-siesa.in/api/v1/usersfiles/getUserFiles/:email/:reason */
const getUserFilesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const reason = req.params.reason;
    const userFilesByUserId = await UserFileService.getUserFilesByUserId(
      userId,
      reason
    );
    res.status(200).json(userFilesByUserId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET -> https://api-siesa.in/api/v1/usersfiles/getFilesForFolder/:id*/
const getFilesByFolderId = async (req, res) => {
  try {
    const folderId = req.params.id;
    const userFilesByFolderId = await UserFileService.getUserFilesByFolderId(
      folderId
    );
    res.status(200).json(userFilesByFolderId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET -> https://api-siesa.in/api/v1/usersfiles/getUserFiles/send-email/:email */
const sendUserFilesByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const { reason } = req.body;
    const userFilesByEmail = await UserFileService.getUserFilesByEmail(
      email,
      reason
    );
    res.status(200).json(userFilesByEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET -> https://api-siesa.in/api/v1/usersfiles/getUserFiles/send-email-link/:email */
const sendUserFilesByEmailLink = async (req, res) => {
  try {
    const email = req.params.email;
    const { reason } = req.body;

    if (!email || !reason) {
      throw new Error(
        "Se requiere tanto el correo electrónico como el motivo para enviar el enlace por correo electrónico."
      );
    }

    const userFilesByEmailLink = await UserFileService.getUserFilesByEmailLink(
      email,
      reason
    );

    console.log(userFilesByEmailLink);
    res.status(200).json(userFilesByEmailLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE -> https://api-siesa.in/api/v1/usersfiles/delete/id */
const deleteUser = async (req, res) => {
  const { id, reason } = req.params;

  try {
    const result = await UserFileService.deleteUser(id, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* POST -> https://api-siesa.in/api/v1/usersfiles/addUserFiles */
const addUserFiles = async (req, res) => {
  const { reason, userId, fileIds } = req.body;

  try {
    const result = await UserFileService.addUserFiles(reason, userId, fileIds);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* POST -> https://api-siesa.in/api/v1/usersfiles/addUserFolders */
const addUserFolders = async (req, res) => {
  const { reason, userId, folderIds } = req.body;

  try {
    const result = await UserFileService.addUserFolders(
      reason,
      userId,
      folderIds
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUsersAndFiles,
  getUserFilesByUserId,
  sendUserFilesByEmail,
  sendUserFilesByEmailLink,
  deleteUser,
  addUserFiles,
  addUserFolders,
  getFilesByFolderId,
};
