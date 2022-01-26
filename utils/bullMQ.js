const { Queue } = require("bullmq");
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const connection = require("../config/connection.conf.json");

const invoiceQueue = new Queue("invoiceQueue", { connection });

const initBullMQ = () => {
  const serverAdapter = new ExpressAdapter();
  invoiceQueue.clean();
  createBullBoard({
    queues: [new BullMQAdapter(invoiceQueue)],
    serverAdapter,
  });

  serverAdapter.setBasePath("/admin/queues");
  return serverAdapter;
};
module.exports = {
  invoiceQueue,
  initBullMQ,
};
