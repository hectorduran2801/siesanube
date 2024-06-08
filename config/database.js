const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  database: process.env.DB,
  username: process.env.USER_DB,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DIALECT_DB,
});

module.exports = sequelize;
