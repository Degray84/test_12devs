const express = require("express");
const router = express.Router();
const { getLogs, removeLogs } = require("../controllers/logs.js");

router.get("/", getLogs);
router.delete("/", removeLogs);

module.exports = router;
