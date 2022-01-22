const Client = require("../models/Client");
const Invoice = require("../models/Invoice");

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
    res.status(201).json({
      success: true,
      data: newClient,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateClient = async function (req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id);
    await client.update(req.body);
    await client.save();
    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeClient = async function (req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id);
    await client.destroy();
    await client.save();
    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};
