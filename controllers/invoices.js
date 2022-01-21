const Invoice = require("../models/Invoice");

exports.getInvoices = async function (req, res, next) {
  try {
    res.send({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
