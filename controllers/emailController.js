const EmailService = require("../services/emailService");

/* GET -> http://localhost:8081/api/v1/emails/getAllEmails */
const getAllEmails = async (req, res) => {
  try {
    const allEmails = await EmailService.getAllEmails();
    res.status(200).json(allEmails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET -> http://localhost:8081/api/v1/emails/getAllEmailLink */
const getAllEmailLink = async (req, res) => {
  try {
    const allEmails = await EmailService.getAllEmailLink();
    res.status(200).json(allEmails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEmails,
  getAllEmailLink,
};
