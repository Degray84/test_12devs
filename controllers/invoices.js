const Client = require("../models/Client");
const Invoice = require("../models/Invoice");

exports.getInvoices = async function (req, res, next) {
  try {
    const invoices = await Invoice.findAll();
    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

exports.getInvoice = async function (req, res, next) {
  try {
    const invoice = await Invoice.findByPk(req.params.id, { include: Client });
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

exports.setInvoice = async function (req, res, next) {
  try {
    const client = await Client.findOne({ where: { email: req.body.email } });

    const newInvoice = await Invoice.create({
      body: req.body.invoice,
      ClientId: client.id,
    });
    res.status(201).json({
      success: true,
      data: newInvoice,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateInvoice = async function (req, res, next) {
  try {
    const invoice = await Invoice.findByPk(req.params.id, { include: Client });
    await invoice.update(req.body);
    await invoice.save();
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};
exports.removeInvoice = async function (req, res, next) {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    await invoice.destroy();
    await invoice.save();
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};
