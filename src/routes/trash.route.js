const express = require('express')
const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')
const trashController = require('../controllers/trash.controller')

const router = express.Router()

// Log user out of all devices
router.put('/:id', authentication, authorization, trashController.restoreDeleteEquipment)

// Get all equipments in trash
router.get('/', authentication, authorization, trashController.getAllDeletedEquipments)

// Force delete an equipment
router.delete('/:id', authentication, authorization, trashController.forceDelete)

module.exports = router