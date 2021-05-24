'use strict'

const Equipment = require('../models/equipment.model')

exports.getAllDeletedEquipments = (req, res) => {
  Equipment
    .find({ deleted: true })
    .then(equipments => {
      res.status(200).send(
        equipments.reverse().map(equipment => {
          return {
            id: equipment._id,
            name: equipment.name,
            type: equipment.type,
            status: equipment.status,
            description: equipment.description || '',
            createdAt: new Date(equipment.createdAt).toLocaleDateString('en-US'),
            deletedAt: new Date(equipment.updatedAt).toLocaleDateString('en-US'),
          }
        })
      )
    })
    .catch(error =>
      res.status(400).send({ error }));
}

exports.restoreDeleteEquipment = (req, res) => {
  Equipment
    .findOneAndUpdate(
      { _id: req.params.id, deleted: true },
      {
        deleted: false,
      },
      { new: true }
    )
    .then(equipment => {
      res.status(200).send(equipment)
    }
    )
    .catch(error => res.status(400).send(error))
}

exports.forceDelete = (req, res) => {
  Equipment
    .deleteOne({ _id: req.params.id })
    .then(() => res.status(200).send("Force Delete Successfully"))
    .catch(error => res.status(400).send(error))
}
