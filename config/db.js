const { Sequelize } = require("sequelize");
require("dotenv").config();

module.exports = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: "localhost",
  dialect: "postgres",
});
