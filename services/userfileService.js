const UserFile = require("../models/userfile");
const User = require("../models/user");
const File = require("../models/file");
const Email = require("../models/email");
const Folder = require("../models/folder");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const archiver = require("archiver");
const fsExtra = require("fs-extra");

const UserFileService = {
  async getUsersAndFiles() {
    try {
      const userFiles = await sequelize.query(
        `
        SELECT "User"."id", 
       CONCAT("User"."firstname", ' ', "User"."lastname") AS full_name, 
       "User"."email",
       MIN("UserFile"."id") AS IdUserFile,
       COUNT("UserFile"."id") AS file_count, 
       "UserFile"."reason" AS "reason"
FROM "UserFiles" AS "UserFile"
INNER JOIN "Users" AS "User" ON "UserFile"."UserId" = "User"."id"
GROUP BY "User"."id", 
         "User"."firstname", 
         "User"."lastname", 
         "User"."email", 
         "UserFile"."reason"
ORDER BY "User"."id" ASC;

        `,
        {
          model: User,
          mapToModel: true,
        }
      );

      return userFiles;
    } catch (error) {
      throw new Error(
        "Error obteniendo archivos de usuarios: " + error.message
      );
    }
  },

  async getUserFilesByUserId(userId, reason) {
    try {
      const userFilesByUserId = await UserFile.findAll({
        where: { UserId: userId, reason: reason },
        include: [
          {
            model: File,
            attributes: ["id", "name", "description", "file", "type"],
          },
          {
            model: Folder,
            attributes: ["id", "name", "description"],
          },
        ],
        order: [
          ["reason", "ASC"],
          ["UserId", "ASC"],
        ],
      });

      const files = userFilesByUserId.map((userFile) => userFile.File);
      const folders = userFilesByUserId.map((userFile) => userFile.Folder);

      return { files, folders };
    } catch (error) {
      throw new Error(
        "Error obteniendo archivos de usuario por ID: " + error.message
      );
    }
  },

  async getUserFilesByFolderId(id) {
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
      throw new Error(
        "Error obteniendo archivos de usuario por ID: " + error.message
      );
    }
  },

  async getUserFilesByEmail(email, reason) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("Usuario no encontrado con este correo electrónico");
      }

      const userId = user.id;
      const userFilesByUserId = await this.getUserFilesByUserId(userId, reason);

      const { files, folders } = userFilesByUserId;

      console.log(folders);

      // Enviar correo solo si hay archivos válidos
      if (
        files &&
        Array.isArray(files) &&
        files.some((file) => file !== null)
      ) {
        await this.sendEmailWithFiles(email, files);
      }

      // Enviar correo solo si hay carpetas válidas
      if (
        folders &&
        Array.isArray(folders) &&
        folders.some((folder) => folder !== null)
      ) {
        await this.sendEmailWithFolders(email, folders);
      }

      return userFilesByUserId;
    } catch (error) {
      throw new Error(
        "Error obteniendo archivos de usuario por correo electrónico: " +
          error.message
      );
    }
  },

  async sendEmailWithFiles(email, files) {
    try {
      const linkWeb = `https://siesa.com.pa/`;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const baseDirectory = path.join(__dirname, "../public/files");

      const attachments = files.map((file) => {
        let filePath;

        if (typeof file === "string") {
          filePath = file;
        } else if (
          typeof file === "object" &&
          file.dataValues &&
          file.dataValues.file
        ) {
          filePath = path.join(baseDirectory, file.dataValues.file);
        } else {
          throw new TypeError(
            `Se esperaba una cadena o un objeto con una propiedad dataValues.file, pero obtuve ${typeof file}`
          );
        }

        if (typeof filePath !== "string") {
          throw new TypeError(
            `Se esperaba una cadena para filePath, pero obtuve ${typeof filePath}`
          );
        }

        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath);
        return {
          filename: fileName,
          content: fileContent,
        };
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Archivos - SIESA",
        html: `
        <p>Estimado usuario,</p>
        <p>Adjuntamos los archivos asignados.</p>
        <p></p>
        <p>Atentamente, <a href="${linkWeb}">SIESA</a></p>
      `,
        attachments: attachments,
      };

      await transporter.sendMail(mailOptions);

      await Email.create({
        email: email,
        type: 1,
        message:
          "¡Correo electrónico enviado exitosamente y registro agregado a la base de datos!",
      });
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar el correo electrónico");
    }
  },

  async sendEmailWithFolders(email, folders) {
    try {
      const linkWeb = `https://siesa.com.pa/`;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const baseDirectory = path.join(__dirname, "../public/files");

      const attachments = [];

      for (const folder of folders) {
        const folderId = folder.id;
        const folderFiles = await this.getUserFilesByFolderId(folderId);

        for (const file of folderFiles.files) {
          const fileName = file.name;
          const filePath = path.join(baseDirectory, fileName);

          if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath);

            attachments.push({
              filename: fileName,
              content: fileContent,
            });
          } else {
            throw new Error(
              `El archivo ${fileName} no fue encontrado en el directorio.`
            );
          }
        }
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Archivos - SIESA",
        html: `
          <p>Estimado usuario,</p>
        <p>Adjuntamos los archivos asignados.</p>
        <p></p>
        <p>Atentamente, <a href="${linkWeb}">SIESA</a></p>
        `,
        attachments: attachments,
      };

      await transporter.sendMail(mailOptions);

      await Email.create({
        email: email,
        type: 1,
        message:
          "¡Correo electrónico enviado exitosamente y registro agregado a la base de datos!",
      });
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar el correo electrónico");
    }
  },

  async getUserFilesByEmailLink(email, reason) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("Usuario no encontrado con este correo electrónico");
      }

      const userId = user.id;
      const userFilesByUserId = await this.getUserFilesByUserId(userId, reason);

      const { files, folders } = userFilesByUserId;

      if (
        files &&
        Array.isArray(files) &&
        files.some((file) => file !== null)
      ) {
        await this.sendEmailLinkWithFiles(email, files, userId, reason);
      }

      if (
        folders &&
        Array.isArray(folders) &&
        folders.some((folder) => folder !== null)
      ) {
        await this.sendEmailLinkWithFilesFolders(
          email,
          folders,
          userId,
          reason
        );
      }

      return userFilesByUserId;
    } catch (error) {
      throw new Error(
        "Error obteniendo enlace por correo electrónico: " + error.message
      );
    }
  },

  async sendEmailLinkWithFiles(email, files, userId, reason) {
    try {
      const dateNow = new Date();

      // Generar el token JWT
      const expiry = Math.floor(dateNow.getTime() + 3 * 24 * 60 * 60 * 1000);
      const payload = { userId, reason, expiry };
      const secretKey = process.env.AUTH;

      const token = jwt.sign(payload, secretKey);
      // enlace

      const link = `https://siesa-app.com/data/files/${token}`;
      const linkWeb = `https://siesa.com.pa/`;

      let qrImage;
      try {
        qrImage = await QRCode.toDataURL(link);
      } catch (error) {
        console.error("Error al generar el código QR:", error);
        throw new Error("Error al generar el código QR");
      }

      // Verificar que qrImage tenga el formato correcto
      if (!qrImage.startsWith("data:image/png;base64,")) {
        throw new Error("Formato incorrecto del código QR generado");
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Enlace - SIESA",
        html: `
         <p>Estimado usuario,</p>
                <p>Enlace para acceder a los archivos asignados: <a href="${link}">Link</a></p>
                <p></p>
                <p>Atentamente, <a href="${linkWeb}">SIESA</a></p>
      `,
        attachments: [
          {
            filename: "qrCode.png",
            content: qrImage.split("base64,")[1],
            encoding: "base64",
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      await Email.create({
        email: email,
        type: 2,
        message:
          "¡Correo electrónico enviado exitosamente y registro agregado a la base de datos!",
      });
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar el correo electrónico");
    }
  },

  async sendEmailLinkWithFilesFolders(email, folders, userId, reason) {
    try {
      const dateNow = new Date();

      // Generar el token JWT
      const expiry = Math.floor(dateNow.getTime() + 3 * 24 * 60 * 60 * 1000);
      const payload = { userId, reason, expiry };
      const secretKey = process.env.AUTH;

      const token = jwt.sign(payload, secretKey);
      // enlace

      const link = `https://siesa-app.com/data/files/${token}`;
      const linkWeb = `https://siesa.com.pa/`;

      let qrImage;
      try {
        qrImage = await QRCode.toDataURL(link);
      } catch (error) {
        console.error("Error al generar el código QR:", error);
        throw new Error("Error al generar el código QR");
      }

      // Verificar que qrImage tenga el formato correcto
      if (!qrImage.startsWith("data:image/png;base64,")) {
        throw new Error("Formato incorrecto del código QR generado");
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Enlace - SIESA",
        html: `
         <p>Estimado usuario,</p>
                <p>Enlace para acceder a los archivos asignados: <a href="${link}">Link</a></p>
                <p></p>
                <p>Atentamente, <a href="${linkWeb}">SIESA</a></p>
      `,
        attachments: [
          {
            filename: "qrCode.png",
            content: qrImage.split("base64,")[1],
            encoding: "base64",
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      await Email.create({
        email: email,
        type: 2,
        message:
          "¡Correo electrónico enviado exitosamente y registro agregado a la base de datos!",
      });
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar el correo electrónico");
    }
  },

  async deleteUser(id, reason) {
    try {
      const userFile = await UserFile.findOne({
        where: { id, reason },
      });

      if (!userFile) {
        throw new Error("UserFile no encontrado.");
      }

      await userFile.destroy();

      return {
        message: "Usuario eliminado con sus archivos exitosamente",
      };
    } catch (error) {
      throw new Error("Error al eliminar usuario: " + error.message);
    }
  },

  async addUserFiles(reason, userId, fileIds) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("Usuario no encontrada");
      }

      const existingReason = await UserFile.findOne({
        where: { reason, UserId: userId },
      });

      if (existingReason) {
        throw new Error("El motivo ya existe para este usuario.");
      }

      const newUserFiles = [];

      for (const fileId of fileIds) {
        const file = await File.findByPk(fileId);

        if (!file) {
          throw new Error("Archivo no encontrado.");
        }

        const newUserFile = await UserFile.create({
          reason,
          UserId: userId,
          FileId: fileId,
        });

        newUserFiles.push(newUserFile);
      }

      return {
        message: "Archivos asignados correctamente a la usuario",
        userFiles: newUserFiles,
      };
    } catch (error) {
      throw new Error("Error al asignar archivos: " + error.message);
    }
  },

  async addUserFolders(reason, userId, folderIds) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("Usuario no encontrada");
      }

      const existingReason = await UserFile.findOne({
        where: { reason, UserId: userId },
      });

      if (existingReason) {
        throw new Error("El motivo ya existe para este usuario.");
      }

      const newUserFiles = [];

      for (const folderId of folderIds) {
        const folder = await Folder.findByPk(folderId);

        if (!folder) {
          throw new Error("Carpeta no encontrada.");
        }

        const newUserFile = await UserFile.create({
          reason,
          UserId: userId,
          FolderId: folderId,
        });

        newUserFiles.push(newUserFile);
      }

      return {
        message: "Carpetas asignadas correctamente a la usuario",
        userFiles: newUserFiles,
      };
    } catch (error) {
      throw new Error("Error al asignar las carptas: " + error.message);
    }
  },
};

module.exports = UserFileService;
