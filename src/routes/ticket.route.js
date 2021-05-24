const express = require('express')
const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')
const ticketController = require('../controllers/ticket.controller')

const router = express.Router()


// Get all tickets
router.get('/', authentication, authorization, ticketController.getAllTickets)

// Get all deleted tickets
router.get('/trash/', authentication, authorization, ticketController.getAllDeletedTickets)

// restore an deleted ticket
router.put('/trash/:id', authentication, authorization, ticketController.restoreTicket)

// force delete ticket
router.delete('/trash/:id', authentication, authorization, ticketController.forceDelete)

// Get ticket
router.get('/:id', authentication, authorization, ticketController.getTicket)

// Get all tickets
router.post('/', authentication, authorization, ticketController.createTicket)

// edit ticket
router.put('/:id', authentication, authorization, ticketController.modifyTicket)

// soft delete an ticket
router.delete('/:id', authentication, authorization, ticketController.softDeleteTicket)

module.exports = router