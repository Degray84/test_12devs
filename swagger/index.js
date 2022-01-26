const { resolve } = require("path");
const swaggerAutogen = require("swagger-autogen")();

console.log("Autogeneration run");

const doc = {
  info: {
    title: "Test API",
    description: "This is the test task API for 12devs company",
  },
  host: `localhost:${process.env.PORT || 5000}`,
  schemes: ["http"],
  tags: [
    {
      name: "Clients",
      description: "List of clients endpoints",
    },
    {
      name: "Invoices",
      description: "List of invoices endpoints",
    },
    {
      name: "Logs",
      description: "List of logs endpoints",
    },
  ],
  definitions: {
    Client: {
      id: 1,
      email: "locer89553@showbaz.com",
      firstname: "Evgeny",
      lastname: "Petrosian",
      company: "Petrosian scammers",
      createdAt: "2022-01-25T07:25:29.925Z",
      updatedAt: "2022-01-25T07:25:29.925Z",
    },
    ClientWithInvoices: {
      id: 1,
      email: "locer89553@showbaz.com",
      firstname: "Evgeny",
      lastname: "Petrosian",
      company: "Petrosian scammers",
      createdAt: "2022-01-25T07:25:29.925Z",
      updatedAt: "2022-01-25T07:25:29.925Z",
      Invoices: [
        {
          id: 1,
          name: "Jessica Roberts",
          phone: "+491724655065",
          currency: "USD",
          invoiceList: '[{"name":"task 1","price":150},{"name":"task 2","price":200},{"name":"task 3","price":100},{"name":"task 4","price":500}]',
          createdAt: "2022-01-25T11:57:03.822Z",
          updatedAt: "2022-01-25T11:57:03.822Z",
          ClientId: 1,
        },
      ],
    },
    Clients: [
      {
        $ref: "#/definitions/Client",
      },
    ],
    Invoice: {
      id: 1,
      name: "Jessica Roberts",
      phone: "+491724655065",
      currency: "USD",
      invoiceList: '[{"name":"task 1","price":150},{"name":"task 2","price":200},{"name":"task 3","price":100},{"name":"task 4","price":500}]',
      createdAt: "2022-01-25T11:57:03.822Z",
      updatedAt: "2022-01-25T11:57:03.822Z",
      ClientId: 1,
    },
    InvoiceWithClient: {
      id: 1,
      name: "Jessica Roberts",
      phone: "+491724655065",
      currency: "USD",
      invoiceList: '[{"name":"task 1","price":150},{"name":"task 2","price":200},{"name":"task 3","price":100},{"name":"task 4","price":500}]',
      createdAt: "2022-01-25T11:57:03.822Z",
      updatedAt: "2022-01-25T11:57:03.822Z",
      ClientId: 1,
      Client: {
        id: 1,
        email: "locer89555@showbaz.com",
        firstname: "Jeff",
        lastname: "Bezos",
        company: "Amazon",
        createdAt: "2022-01-25T07:25:29.925Z",
        updatedAt: "2022-01-25T07:25:29.925Z",
      },
    },
    Invoices: [
      {
        $ref: "#/definitions/Invoice",
      },
    ],
    Log: {
      id: 1,
      type: "INSTALL_CLIENTS",
      table: "CLIENTS",
      status: true,
      message: "Clients from JSON isntalled",
      body: null,
      createdAt: "2022-01-25T07:25:29.949Z",
      updatedAt: "2022-01-25T07:25:29.949Z",
    },
    Logs: [
      {
        $ref: "#/definitions/Log",
      },
    ],
  },
};

const outputFile = resolve(__dirname, "output.json");
const endpointsFiles = [resolve(__dirname, "../server.js")];

swaggerAutogen(outputFile, endpointsFiles, doc).then(({ success }) => {
  console.log(`Generated: ${success}`);
});
