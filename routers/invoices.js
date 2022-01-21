const express = require("express");
const router = express.Router();
const { getInvoices } = require("../controllers/invoices.js");

router.get("/", getInvoices);

module.exports = router;
