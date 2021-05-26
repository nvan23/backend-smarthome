const express = require('express')
const requireAuthentication = require('../middleware/requireAuthentication')
const requireAuthorization = require('../middleware/requireAuthorization')
const ticketController = require('../controllers/ticket.controller')

const router = express.Router()


// Get all tickets
router.get('/', requireAuthentication, requireAuthorization, ticketController.getAllTickets)

// Get all deleted tickets
router.get('/trash/', requireAuthentication, requireAuthorization, ticketController.getAllDeletedTickets)

// restore an deleted ticket
router.put('/trash/:id', requireAuthentication, requireAuthorization, ticketController.restoreTicket)

// force delete ticket
router.delete('/trash/:id', requireAuthentication, requireAuthorization, ticketController.forceDelete)

// Get ticket
router.get('/:id', requireAuthentication, requireAuthorization, ticketController.getTicket)

// Get all tickets
router.post('/', requireAuthentication, requireAuthorization, ticketController.createTicket)

// edit ticket
router.put('/:id', requireAuthentication, requireAuthorization, ticketController.modifyTicket)

// soft delete an ticket
router.delete('/:id', requireAuthentication, requireAuthorization, ticketController.softDeleteTicket)

module.exports = router