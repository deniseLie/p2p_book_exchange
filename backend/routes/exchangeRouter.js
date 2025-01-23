const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route for creating a new exchange request
router.post('/create', verifyToken, exchangeController.createExchangeRequest);

// Route for updating the status of an exchange
router.put('/update', verifyToken, exchangeController.updateExchangeStatus);

// Route for fetching all exchanges for a specific user
router.get('/user/:userID', verifyToken, exchangeController.getUserExchanges);

// Get a specific exchange details by exchange id 
router.get('/:exchangeId', verifyToken, exchangeController.getExchangeById);

// Get all pending exchanges where the user is the owner (someone is requesting the user's books)
router.get('/pending', verifyToken, exchangeController.getPendingExchanges);

module.exports = router;
