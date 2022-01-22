const express = require("express");
const router = express.Router();
const { getInvoices, getInvoice, setInvoice, updateInvoice, removeInvoice } = require("../controllers/invoices.js");

router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.post("/", setInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", removeInvoice);

module.exports = router;
