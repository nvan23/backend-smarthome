'use strict'

const config = require('../../config')
const Role = require("../../models/role.model")

exports.getAllRoles = async (req, res) => {
  Role
    .find()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
}

exports.getRole = async (req, res) => {
  Role
    .find({ _id: req.params.id })
    .then(data => res.status(200).json(data))
    .catch(() => res.status(400).json({ error: "Cannot found" }))
}


exports.create = async (req, res) => {
  try {
    const role = new Role(req.body, config.role.user)
    await role.save()

    res.status(200).json({ message: "Create new role successfully" })
  } catch ({ errors }) {
    res.status(400).json(errors)
  }
}

exports.deleteAllRoles = async (req, res) => {
  Role
    .deleteMany()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
}

exports.delete = async (req, res) => {
  Role
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(200).json({ message: "Removing role successfully" }))
    .catch(() => res.status(400).json({ error: "Cannot found" }))
}

exports.update = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)

    if (!role) throw { error: "Cannot found role" }
    if (!req.body.name || req.body.name === role.name) throw { error: "Input error" }

    Role
      .findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
      .then(data => res.status(200).json(data))
      .catch(() => res.status(400).json({ error: "Cannot found" }))

  } catch (error) {
    res.status(400).json(error)
  }
}

