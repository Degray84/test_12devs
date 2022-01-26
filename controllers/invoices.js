const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const Log = require("../models/Log");
const { invoiceQueue } = require("../utils/bullMQ");
const { Worker } = require("bullmq");
const createPDF = require("../utils/html2pdf");
const sendEmail = require("../utils/nodemailer");
const connection = require("../config/connection.conf.json");

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
    const pdfWorker = new Worker(
      "invoiceQueue",
      async (job) => {
        if (job.name === "createInvoice") {
          const client = await Client.findOne({ where: { email: job.data.email } });
          const rawInvoice = {
            ...job.data,
            invoiceList: JSON.stringify(job.data.invoiceList),
            ClientId: client.id,
          };
          const createdInvoice = await Invoice.create(rawInvoice);
          const newInvoice = await Invoice.findByPk(createdInvoice.id, { include: Client });
          const pdfBuffer = await createPDF(newInvoice);
          await sendEmail(pdfBuffer);
          return newInvoice;
        }
      },
      { connection }
    );
    await invoiceQueue.add("createInvoice", req.body);
    pdfWorker.on("completed", async (job, returnvalue) => {
      await Log.create({ type: "SET_INVOICE", table: "INVOICES", status: true, message: "Invoice is created", body: JSON.stringify(req.body) });
      res.status(201).json({
        success: true,
        data: returnvalue,
      });
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
