const File = require("../models/file");
const Discipline = require("../models/discipline");
const UserFile = require("../models/userfile");
const path = require("path");
const fs = require("fs");

const FileService = {
  async addFile(name, description, file, DisciplineId) {
    console.log(file);
    try {
      const discipline = await Discipline.findByPk(DisciplineId);

      if (!discipline) {
        throw new Error("Dato asociado no encontrado (disciplina).");
      }

      const newFile = await File.create({
        name,
        description,
        file: file.filename,
        type: file.mimetype,
        DisciplineId,
      });

      return {
        message: "Archivo registrado exitosamente.",
        file: newFile,
      };
    } catch (error) {
      throw new Error("Error al registrar el archivo: " + error.message);
    }
  },

  async updateFile(id, updatedData, file) {
    try {
      const files = await File.findByPk(id, {
        include: [Discipline],
      });

      if (!files) {
        throw new Error("Archivo no encontrado.");
      }

      const { name, description, disciplineId, ...fields } = updatedData;

      if (disciplineId) {
        const discipline = await Discipline.findByPk(disciplineId);
        if (!discipline) {
          throw new Error(
            "Disciplina no encontrada para el archivo actualizado."
          );
        }
        fields.DisciplineId = disciplineId;
      }

      // Eliminar archivos antiguos del sistema de archivos
      const oldFile = files.dataValues.file;

      if (file && oldFile !== file.filename) {
        const filePath = path.join(__dirname, "../public/files", oldFile);
        console.log("Ubicación del archivo a eliminar:", filePath);

        // Verificar si el archivo existe antes de intentar eliminarlo
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Archivo eliminado:", filePath);
        } else {
          console.log("El archivo no existe:", filePath);
        }

        updatedData.file = file.filename;
      }

      await files.update(updatedData);

      return {
        message: "Archivo actualizado correctamente.",
        file: updatedData,
      };
    } catch (error) {
      throw new Error("Error al actualizar el archivo: " + error.message);
    }
  },

  async deleteFile(id) {
    try {
      const file = await File.findByPk(id);

      if (!file) {
        throw new Error("Archivo no encontrado.");
      }

      const oldFiles = file.dataValues.file;

      if (oldFiles.length > 0) {
        const filePath = path.join(
          __dirname,
          "../public/files",
          file.dataValues.file
        );
        console.log("Ubicación del archivo a eliminar:", filePath);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Archivo eliminado:", filePath);
        } else {
          console.log("El archivo no existe:", filePath);
        }
      }

      await UserFile.destroy({
        where: {
          FileId: file.dataValues.id,
        },
      });

      await file.destroy();

      return {
        message: "Archivo eliminado exitosamente.",
        file,
      };
    } catch (error) {
      throw new Error("Error al eliminar el archivo: " + error.message);
    }
  },

  async getAllFiles() {
    try {
      const files = await File.findAll({
        include: [
          {
            model: Discipline,
            attributes: ["id", "name"],
            as: "Discipline",
          },
        ],
        order: [["id", "ASC"]],
      });
      return files;
    } catch (error) {
      throw new Error("Error al obtener archivos: " + error.message);
    }
  },

  async getFileDetailsById(id) {
    try {
      const file = await File.findOne({
        where: { id: id },
        attributes: [
          "id",
          "name",
          "description",
          "type",
          "DisciplineId",
          "file",
        ],
      });

      return file;
    } catch (error) {
      throw new Error("Error al recuperar datos del archivo: " + error.message);
    }
  },

  async getURLFileDetailsById(id) {
    try {
      const file = await File.findOne({
        where: { id: id },
        attributes: ["name", "description", "type", "file"],
      });

      return {
        url: file.file,
        name: file.name,
        type: file.type,
        description: file.description,
      };
    } catch (error) {
      throw new Error("Error al recuperar datos del archivo: " + error.message);
    }
  },
};

module.exports = FileService;
