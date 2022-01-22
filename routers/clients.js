const express = require("express");
const router = express.Router();
const { getClients, getClient, setClient, updateClient, removeClient } = require("../controllers/clients.js");


router.get("/", getClients);
router.get("/:id", getClient);
router.post("/", setClient);
router.put("/:id", updateClient);
router.delete("/:id", removeClient);

module.exports = router;
