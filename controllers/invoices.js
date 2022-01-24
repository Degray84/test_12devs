const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const Log = require("../models/Log");
const createPDF = require("../utils/html2pdf");

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
    const pdfBuffer = await createPDF(invoice);
    console.log(pdfBuffer);
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
    const rawInvoice = {
      ...req.body,
      invoiceList: JSON.stringify(req.body.invoiceList),
      ClientId: client.id,
    };
    const newInvoice = await Invoice.create(rawInvoice);
    console.log(newInvoice);
    await Log.create({ type: "SET_INVOICE", table: "INVOICES", status: true, message: "Invoice is created", body: JSON.stringify(req.body) });
    res.status(201).json({
      success: true,
      data: newInvoice,
    });
  } catch (error) {
    await Log.create({ type: "SET_INVOICE", table: "INVOICES", status: false, message: error.message, body: JSON.stringify(req.body) });
    next(error);
  }
};

exports.updateInvoice = async function (req, res, next) {
  try {
    const invoice = await Invoice.findByPk(req.params.id, { include: Client });
    await invoice.update(req.body);
    await invoice.save();
    await Log.create({ type: "UPDATE_INVOICE", table: "INVOICES", status: true, message: "Invoice is updated", body: JSON.stringify(req.body) });
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    await Log.create({ type: "UPDATE_INVOICE", table: "INVOICES", status: false, message: error.message, body: JSON.stringify(req.body) });
    next(error);
  }
};
exports.removeInvoice = async function (req, res, next) {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    await invoice.destroy();
    await invoice.save();
    await Log.create({ type: "REMOVE_INVOICE", table: "INVOICES", status: true, message: "Invoice is deleted" });
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    await Log.create({ type: "REMOVE_INVOICE", table: "INVOICES", status: false, message: error.message });
    next(error);
  }
};
