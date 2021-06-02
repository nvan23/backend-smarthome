const express = require('express')
const requireAuthentication = require('../../middleware/requireAuthentication')
const requireAuthorization = require('../../middleware/requireAuthorization')
const trashController = require('../controllers/trash.controller')

const router = express.Router()

// Log user out of all devices
router.put('/:id', requireAuthentication, requireAuthorization, trashController.restoreDeleteEquipment)

// Get all equipments in trash
router.get('/', requireAuthentication, requireAuthorization, trashController.getAllDeletedEquipments)

// Force delete an equipment
router.delete('/:id', requireAuthentication, requireAuthorization, trashController.forceDelete)

module.exports = router