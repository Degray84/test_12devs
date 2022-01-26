const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const Log = require("../models/Log");
const clientsArray = require("../config/clients.json");

exports.getClients = async function (req, res, next) {
  try {
    /*
    #swagger.tags = ["Clients"];
    #swagger.description = "Get all clients";
    #swagger.responses[200] = {
      description: "Array of all clients",
      schema: {
        success: true,
        data: { $ref: "#/definitions/Clients" },
      },
    };
    */
    const clients = await Client.findAll();
    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

exports.getClient = async function (req, res, next) {
  try {
    /*
    #swagger.tags = ["Clients"];
    #swagger.description = "Get one client";
    #swagger.parameters["id"] = {
      description: "Existing client ID",
      type: "integer",
      required: true,
    };
    #swagger.responses[200] = {
      description: "Information about one client with his invoices",
      schema: {
        success: true,
        data: { $ref: "#/definitions/ClientWithInvoices" },
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
    const client = await Client.findByPk(req.params.id, { include: Invoice });
    if (client) {
      res.status(200).json({
        success: true,
        data: client,
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

exports.setClient = async function (req, res, next) {
  /*
  #swagger.tags = ["Clients"];
  #swagger.description = "Create new client";
  #swagger.parameters["obj"] = {
    in: "body",
    description: "Client data",
    required: true,
    schema: {
      email: "locer89553@showbaz.com",
      firstname: "Evgeny",
      lastname: "Petrosian",
      company: "Petrosian scammers",
    },
  };
  #swagger.responses[201] = {
    description: "New client information",
    schema: {
      success: true,
      data: { $ref: "#/definitions/Client" },
    },
  };
  */
  try {
    const newClient = await Client.create({
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      company: req.body.company,
    });
    await Log.create({ type: "SET_CLIENT", table: "CLIENTS", status: true, message: "Client is created", body: JSON.stringify(req.body) });
    res.status(201).json({
      success: true,
      data: newClient,
    });
  } catch (error) {
    await Log.create({ type: "SET_CLIENT", table: "CLIENTS", status: false, message: error.message, body: JSON.stringify(req.body) });
    next(error);
  }
};

exports.updateClient = async function (req, res, next) {
  /*
  #swagger.tags = ["Clients"];
  #swagger.description = "Update client";
  #swagger.parameters["id"] = {
      description: "Existing client ID",
      type: "integer",
      required: true,
  };
  #swagger.parameters["obj"] = {
    in: "body",
    description: "Some client data",
    schema: {
      company: "Petrosian scammers",
    },
  };
  #swagger.responses[200] = {
    description: "Updated client information",
    schema: {
      success: true,
      data: { $ref: "#/definitions/Client" },
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
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.update(req.body);
      await client.save();
      await Log.create({ type: "UPDATE_CLIENT", table: "CLIENTS", status: true, message: "Client is updated", body: JSON.stringify(req.body) });
      res.status(200).json({
        success: true,
        data: client,
      });
    } else {
      await Log.create({ type: "UPDATE_CLIENT", table: "CLIENTS", status: false, message: "Client not found", body: JSON.stringify(req.body) });
      res.status(404).json({
        success: false,
        data: 0,
      });
    }
  } catch (error) {
    await Log.create({ type: "UPDATE_CLIENT", table: "CLIENTS", status: false, message: error.message, body: JSON.stringify(req.body) });
    next(error);
  }
};

exports.removeClient = async function (req, res, next) {
  /*
  #swagger.tags = ["Clients"];
  #swagger.description = "Delete client";
  #swagger.parameters["id"] = {
      description: "Existing client ID",
      type: "integer",
      required: true,
  };
  #swagger.responses[200] = {
    description: "Client is removed",
    schema: {
      success: true,
      data: 0,
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
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.destroy();
      await client.save();
      await Log.create({ type: "REMOVE_CLIENT", table: "CLIENTS", status: true, message: "Client is removed", body: JSON.stringify(req.body) });
      res.status(200).json({
        success: true,
        data: client,
      });
    } else {
      await Log.create({ type: "REMOVE_CLIENT", table: "CLIENTS", status: false, message: "Client not found", body: JSON.stringify(req.body) });
      res.status(404).json({
        success: false,
        data: 0,
      });
    }
  } catch (error) {
    await Log.create({ type: "REMOVE_CLIENT", table: "CLIENTS", status: false, message: error.message, body: JSON.stringify(req.body) });
    next(error);
  }
};

exports.installClients = async function (req, res, next) {
  /*
    #swagger.tags = ["Clients"];
    #swagger.description = "Create a bunch of clients from clients.json";
    #swagger.responses[200] = {
    description: "Array of new clients",
    schema: {
      success: true,
      data: { $ref: "#/definitions/Clients" },
    },
  };
  */
  try {
    const newClients = [];
    for (const clientFromArray of clientsArray) {
      newClients.push(await Client.create(clientFromArray));
    }
    await Log.create({ type: "INSTALL_CLIENTS", table: "CLIENTS", status: true, message: "Clients from JSON installed" });
    res.status(200).json({
      success: true,
      data: newClients,
    });
  } catch (error) {
    await Log.create({ type: "INSTALL_CLIENTS", table: "CLIENTS", status: false, message: error.message });
    next(error);
  }
};
