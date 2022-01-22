const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Client = require("./Client");
const Invoice = sequelize.define("Invoice", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Client.hasMany(Invoice, {
  foreignKey: {
    allowNull: false,
  },
});
Invoice.belongsTo(Client);
module.exports = Invoice;
