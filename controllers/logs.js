const Log = require("../models/Log");

exports.getLogs = async function (req, res, next) {
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
  try {
    await Log.destroy({ where: {}, truncate: true });
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
