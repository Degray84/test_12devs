const Log = require("../models/Log");

exports.getLogs = async function (req, res, next) {
  /*
    #swagger.tags = ["Logs"];
    #swagger.description = "Get all logs";
    #swagger.responses[200] = {
      description: "Array of all logs",
      schema: {
        success: true,
        data: { $ref: "#/definitions/Logs" },
      },
    };
  */
  try {
    const logs = await Log.findAll();
    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeLogs = async function (req, res, next) {
  /*
    #swagger.tags = ["Logs"];
    #swagger.description = "Delete all logs";
    #swagger.responses[200] = {
      schema: {
        success: true,
        data: 0
      },
    };
  */
  try {
    const logs = await Log.destroy({ where: {}, truncate: true });
    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
