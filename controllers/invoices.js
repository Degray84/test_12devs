const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const Log = require("../models/Log");
const { invoiceQueue } = require("../utils/bullMQ");
const { Worker } = require("bullmq");
const createPDF = require("../utils/html2pdf");
const sendEmail = require("../utils/nodemailer");
const connection = require("../config/connection.conf.json");

exports.getInvoices = async function (req, res, next) {
  /*
    #swagger.tags = ["Invoices"];
    #swagger.description = "Get all invoices";
    #swagger.responses[200] = {
      description: "Array of all invoices",
      schema: {
        success: true,
        data: { $ref: "#/definitions/Invoices" },
      },
    };
  */
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
  /*
    #swagger.tags = ["Invoices"];
    #swagger.description = "Get one invoice";
    #swagger.parameters["id"] = {
      description: "Existing invoice ID",
      type: "integer",
      required: true,
    };
    #swagger.responses[200] = {
      description: "Information about invoice with it's client",
      schema: {
        success: true,
        data: { $ref: "#/definitions/InvoiceWithClient" },
      },
    };
    #swagger.responses[404] = {
      description: "Invoice not found",
      schema: {
        success: false,
        data: 0,
      },
    };
  */
  try {
    const invoice = await Invoice.findByPk(req.params.id, { include: Client });
    if (invoice) {
      res.status(200).json({
        success: true,
        data: invoice,
      });
    } else {
      res.status(404).json({
        success: false,
        data: 0,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.setInvoice = async function (req, res, next) {
  /*
  #swagger.tags = ["Invoices"];
  #swagger.description = "Create new Invoice and send it to client's email";
  #swagger.parameters["obj"] = {
    in: "body",
    description: "Invoice data",
    required: true,
    schema: {
      email: "roberts8445@gmail.com",
      name: "Jessica Roberts",
      phone: "+491724655065",
      currency: "USD",
      invoiceList: [
        {
          name: "task 1",
          price: 150,
        },
        {
          name: "task 2",
          price: 200,
        },
        {
          name: "task 3",
          price: 100,
        },
        {
          name: "task 4",
          price: 500,
        },
      ],
    },
  };
  #swagger.responses[201] = {
    description: "New invoice information",
    schema: {
      success: true,
      data: { $ref: "#/definitions/Invoice" },
    },
  };
  #swagger.responses[404] = {
      description: "Client not found",
      schema: {
        success: false,
        data: 0,
      },
    };
  */
  try {
    const pdfWorker = new Worker(
      "invoiceQueue",
      async (job) => {
        if (job.name === "createInvoice") {
          const client = await Client.findOne({ where: { email: job.data.email } });
          if (client) {
            const rawInvoice = {
              ...job.data,
              invoiceList: JSON.stringify(job.data.invoiceList),
              ClientId: client.id,
            };
            const createdInvoice = await Invoice.create(rawInvoice);
            const newInvoice = await Invoice.findByPk(createdInvoice.id, { include: Client });
            await Log.create({ type: "SET_INVOICE", table: "INVOICES", status: true, message: "Invoice is created", body: JSON.stringify(req.body) });
            res.status(201).json({
              success: false,
              data: newInvoice,
            });
          } else {
            await Log.create({ type: "SET_INVOICE", table: "INVOICES", status: true, message: "Client not found", body: JSON.stringify(req.body) });
            res.status(404).json({
              success: false,
              data: 0,
            });
          }
        }
      },
      { connection }
    );
    await invoiceQueue.add("createInvoice", req.body);
    pdfWorker.on("completed", async (job, returnvalue) => {});
  } catch (error) {
    await Log.create({ type: "SET_INVOICE", table: "INVOICES", status: false, message: error.message, body: JSON.stringify(req.body) });
    res.json({
      success: false,
      data: 0,
    });
    next(error);
  }
};

exports.removeInvoice = async function (req, res, next) {
  /*
  #swagger.tags = ["Invoices"];
  #swagger.description = "Delete invoice";
  #swagger.parameters["id"] = {
      description: "Existing invoice ID",
      type: "integer",
      required: true,
  };
  #swagger.responses[200] = {
    description: "Invoice is removed",
    schema: {
      success: true,
      data: 0,
    },
  };
  #swagger.responses[404] = {
    description: "Invoice not found",
    schema: {
      success: false,
      data: 0,
    },
  };
  */
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (invoice) {
      await invoice.destroy();
      await invoice.save();
      await Log.create({ type: "REMOVE_INVOICE", table: "INVOICES", status: true, message: "Invoice is deleted" });
      res.status(200).json({
        success: true,
        data: invoice,
      });
    } else {
      await Log.create({ type: "REMOVE_INVOICE", table: "INVOICES", status: true, message: "Invoice not found" });
      res.status(404).json({
        success: true,
        data: 0,
      });
    }
  } catch (error) {
    await Log.create({ type: "REMOVE_INVOICE", table: "INVOICES", status: false, message: error.message });
    next(error);
  }
};
