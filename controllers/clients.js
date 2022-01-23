const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const Log = require("../models/Log");

exports.getClients = async function (req, res, next) {
  try {
    const clients = await Client.findAll();
    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

exports.getClient = async function (req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id, { include: Invoice });

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

exports.setClient = async function (req, res, next) {
  try {
    const newClient = await Client.create({
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      company: req.body.company,
    });
    await Log.create({ type: "SET_CLIENT", table: "CLIENTS", status: true, message: "Client is created", body: JSON.stringify(req.body) });
    res.status(201).json({
      success: true,
      data: newClient,
    });
  } catch (error) {
    await Log.create({ type: "SET_CLIENT", table: "CLIENTS", status: false, message: error.message, body: JSON.stringify(req.body) });
    next(error);
  }
};

exports.updateClient = async function (req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id);
    await client.update(req.body);
    await client.save();
    await Log.create({ type: "UPDATE_CLIENT", table: "CLIENTS", status: true, message: "Client is updated", body: JSON.stringify(req.body) });
    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    await Log.create({ type: "UPDATE_CLIENT", table: "CLIENTS", status: false, message: error.message, body: JSON.stringify(req.body) });
    next(error);
  }
};

exports.removeClient = async function (req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id);
    await client.destroy();
    await client.save();
    await Log.create({ type: "REMOVE_CLIENT", table: "CLIENTS", status: true, message: "Client is removed", body: JSON.stringify(req.body) });
    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    await Log.create({ type: "REMOVE_CLIENT", table: "CLIENTS", status: false, message: error.message, body: JSON.stringify(req.body) });
    next(error);
  }
};
