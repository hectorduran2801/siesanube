const UserFile = require("../models/userfile");
const User = require("../models/user");
const File = require("../models/file");
const Email = require("../models/email");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const secretKey = process.env.AUTH;

function generateToken(userId, reason) {
  var dateNow = new Date();
  const payload = {
    userId,
    reason,
    expiry: Math.floor(dateNow.getTime() + 60),
  };
  const token = jwt.sign(payload, secretKey);
  return token;
}

function generateLink(token) {
  return `http://localhost:3000/data/files/${token}`;
}

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
        ],
        order: [
          ["reason", "ASC"],
          ["UserId", "ASC"],
        ],
      });

      const files = userFilesByUserId.map((userFile) => userFile.File);

      return { files };
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

      // logica de envios
      await this.sendEmailWithFiles(email, userFilesByUserId.files);

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
        <p>Adjuntamos los archivos solicitados en respuesta a tu solicitud.</p>
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

      // logica de envios
      await this.sendEmailLinkWithFiles(
        email,
        userFilesByUserId.files,
        userId,
        reason
      );

      return userFilesByUserId;
    } catch (error) {
      throw new Error(
        "Error obteniendo enlace por correo electrónico: " + error.message
      );
    }
  },

  async generateQRCode(data) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data);
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error al generar el código QR:", error);
      throw new Error("Error al generar el código QR");
    }
  },

  async sendEmailLinkWithFiles(email, files, userId, reason) {
    try {
      // enlace
      const token = generateToken(userId, reason);
      const link = generateLink(token);
      const linkWeb = `https://siesa.com.pa/`;

      // QR
      const qrData = JSON.stringify({
        id: userId,
        email: email,
        reason: reason,
        files: files.map((file) => ({
          name: file.name,
          description: file.description,
          file: file.file,
          type: file.type,
        })),
      });
      const qrImage = await this.generateQRCode(qrData);

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
        <p>Aquí está el enlace solicitado: <a href="${link}">Enlace</a></p>
        <p></p>
        <p>Atentamente, <a href="${linkWeb}">SIESA</a></p>
      `,
        attachments: [
          {
            filename: "qrCode.png",
            content: qrImage.split("base64,")[1],
            encoding: "base64",
          },
          {
            filename: "logosiesa.png",
            path: path.join(__dirname, "../public/SiESAA.png"),
            cid: "logosiesa_image",
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      const emailLog = await Email.create({
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
        throw new Error("Usuario no encontrado.");
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
};

module.exports = UserFileService;
