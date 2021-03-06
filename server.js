const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const { initBullMQ } = require("./utils/bullMQ");
const swaggerUi = require("swagger-ui-express");

// configs
require("colors");
require("dotenv").config();

// Routers
const invoices = require("./routers/invoices.js");
const clients = require("./routers/clients.js");
const logs = require("./routers/logs.js");

const PORT = process.env.PORT || 5000;

const app = express();

// app.use(express.static('dist'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(morgan("dev"));

// use Routers
app.use("/api/invoices", invoices);
app.use("/api/clients", clients);
app.use("/api/logs", logs);

// init BullMQ
const serverAdapter = initBullMQ();
app.use("/queues", serverAdapter.getRouter());

// init Swagger documentation
const swaggerFile = JSON.parse(fs.readFileSync("./swagger/output.json"));
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Errors
app.use(function (err, req, res, next) {
  res.status(500).send({
    success: false,
    error: err.message,
    data: null,
  });
});

async function start() {
  connectDB
    .sync()
    .then((db) => {
      app.listen(PORT, () => {
        console.log("Сервер запущен в окружении ".cyan + process.env.NODE_ENV.magenta + " на порту ".cyan + PORT.magenta + " ...".cyan);
      });
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", error);
    });
}
start();
