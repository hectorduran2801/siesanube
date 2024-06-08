require("dotenv").config();

module.exports = {
  jwtSecret: process.env.AUTH,
};
