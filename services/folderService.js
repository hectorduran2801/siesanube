const Folder = require("../models/folder");
const path = require("path");
const fs = require("fs");

const FolderService = {
  async addFolder(name, description, files) {
    try {
      const existingFolder = await Folder.findOne({ where: { name } });

      /* if (existingFolder) {
            throw new Error("Esta carpeta ya existe.");
          } */

      if (!files || files.length === 0) {
        throw new Error("Proporcione al menos un archivo para la carpeta.");
      }

      const folders = files.map((file) => file.filename);

      const newFolder = await Folder.create({
        name,
        description,
        files: JSON.stringify(folders),
      });

      await newFolder.save();

      return {
        message: "Carpeta registrada exitosamente.",
        folder: newFolder,
      };
    } catch (error) {
      throw new Error("Error al registrar la carpeta: " + error.message);
    }
  },

  async getAllFolders() {
    try {
      const folders = await Folder.findAll({
        order: [["id", "ASC"]],
      });
      return folders;
    } catch (error) {
      throw new Error("Error al obtener las carpetas: " + error.message);
    }
  },

  async deleteFolder(id) {
    try {
      // Buscar la carpeta por su ID
      const folder = await Folder.findByPk(id);

      if (!folder) {
        throw new Error("Carpeta no encontrada.");
      }

      const files = JSON.parse(folder.dataValues.files);

      console.log(files);

      files.forEach((file) => {
        const filePath = path.join(__dirname, "../public/files", file);
        console.log("Ubicación del archivo a eliminar:", filePath);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Archivo eliminado:", filePath);
        } else {
          console.log("El archivo no existe:", filePath);
        }
      });

      await folder.destroy();

      return {
        message: "Carpeta eliminada exitosamente.",
        folder,
      };
    } catch (error) {
      throw new Error("Error al eliminar la carpeta: " + error.message);
    }
  },

  async getURLFileDetailsByName(name) {
    try {
      const fileExtension = name.split(".").pop();

      const fileDetails = {
        url: `https://api-siesa.in/archivos/${name}`,
        name: name,
        extension: fileExtension.toLowerCase(),
      };

      return fileDetails;
    } catch (error) {
      throw new Error("Error al recuperar datos del archivo: " + error.message);
    }
  },

  async getFilesDetailsById(id) {
    try {
      const folder = await Folder.findOne({
        where: { id: id },
        attributes: ["files"],
      });

      if (!folder) {
        throw new Error("Carpeta no encontrada");
      }

      const fileDetailsRaw = JSON.parse(folder.files);

      if (!Array.isArray(fileDetailsRaw)) {
        throw new Error("La estructura de archivos no es la esperada");
      }

      const transformedFiles = fileDetailsRaw.map((fileName, index) => {
        const extension = fileName.split(".").pop().toLowerCase();
        return {
          id: index + 1,
          name: fileName,
          extension: extension,
        };
      });

      const fileDetails = {
        files: transformedFiles,
      };

      return fileDetails;
    } catch (error) {
      throw new Error("Error al recuperar datos del carpeta: " + error.message);
    }
  },
};

module.exports = FolderService;
