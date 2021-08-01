'use strict'

const Device = require("../../../models/device.model")

exports.getAllDevices = async (req, res) => {
  try {
    Device
      .find()
      .sort({ createdAt: 'desc' })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}
