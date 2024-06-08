const Email = require("../models/email");
const path = require("path");
const fs = require("fs");

const EmailService = {
  async getAllEmails() {
    try {
      const emails = await Email.findAll({
        where: {
          type: 1,
        },
        order: [["id", "ASC"]],
      });
      return emails;
    } catch (error) {
      throw new Error("Error al obtener emails: " + error.message);
    }
  },

  async getAllEmailLink() {
    try {
      const emails = await Email.findAll({
        where: {
          type: 2,
        },
        order: [["id", "ASC"]],
      });
      return emails;
    } catch (error) {
      throw new Error("Error al obtener emails: " + error.message);
    }
  },
};

module.exports = EmailService;
