const express = require('express')
const homesController = require('../../controllers/homes')

const router = express.Router()

// create an new home from admin
router.post('/', homesController.create)

// get an all homes
router.get('/', homesController.getAllHomes)

// get an home
router.get('/:id', homesController.getHome)

// block access of home
router.patch('/block/:id', homesController.block(true))

// active access of home
router.patch('/active/:id', homesController.block(false))

// update home information
router.put('/:id', (__, res) => res.json({ msg: "update home information" }))

// delete a home
router.delete('/:id', homesController.delete)

// delete all homes
router.delete('/', homesController.deleteAllHomes)

module.exports = router