const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

// Route for creating a new exchange request
router.post('/create', exchangeController.createExchangeRequest);

// Route for updating the status of an exchange
router.put('/update', exchangeController.updateExchangeStatus);

// Route for fetching all exchanges for a specific user
router.get('/user/:userID', exchangeController.getUserExchanges);

// Route for fetching all exchanges for a specific user
router.get('/exchange/:exchangeID', getExchangeById);

module.exports = router;
