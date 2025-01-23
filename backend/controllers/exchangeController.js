const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Exchange = require('../models/exchangeModel');

// Create exchange request
exports.createExchangeRequest = async (req, res) => {
    try {
        const { requesterUserID, ownerUserID, ownerBookID } = req.body;
    
        // Validate if the user exists
        const requester = await User.findById(requesterUserID);
        const owner = await User.findById(ownerUserID);
    
        if (!requester || !owner) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if books exist
        const ownerBooks = await Book.find({ '_id': { $in: ownerBookID } });
    
        if (ownerBooks.length !== ownerBookID.length) {
            return res.status(404).json({ message: 'One or more books not found' });
        }
    
        // Create a new exchange request
        const exchange = new Exchange({
            requesterUserID,
            ownerUserID,
            ownerBookID,
        });
    
        const savedExchange = await exchange.save();
    
        res.status(201).json({
            message: 'Exchange request created successfully',
            exchange: savedExchange,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};

// Update status of exchange request
exports.updateExchangeStatus = async (req, res) => {
    try {
        const { exchangeID, status } = req.body;
    
        // Validate status
        if (!['pending', 'denied', 'inprogress', 'halfApproved', 'canceled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
    
        // Find the exchange by ID
        const exchange = await Exchange.findById(exchangeID);
    
        if (!exchange) {
            return res.status(404).json({ message: 'Exchange not found' });
        }
    
        // Update the exchange status
        exchange.status = status;
        exchange.updatedAt = Date.now();
    
        const updatedExchange = await exchange.save();
    
        res.status(200).json({
            message: 'Exchange status updated successfully',
            exchange: updatedExchange,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};

// Fetch all exchange requests
exports.getUserExchanges = async (req, res) => {
    try {
        const userId = req.user._id; 

        const exchanges = await Exchange.find({
            $or: [{ requesterUserID: userId }, { ownerUserID: userId }],
        }).populate('requesterUserID ownerUserID requesterBookID ownerBookID');

        res.status(200).json({
            message: 'Exchanges fetched successfully',
            exchanges,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};

// Fetch a specific exchange request by exchangeID
exports.getExchangeById = async (req, res) => {
    try {
        const { exchangeId } = req.params; // Get the exchangeID from the route parameter

        // Find the exchange by ID and populate related fields
        const exchange = await Exchange.findById(exchangeId)
            .populate('requesterUserID ownerUserID requesterBookID ownerBookID');

        if (!exchange) {
            return res.status(404).json({ message: 'Exchange not found' });
        }

        res.status(200).json({
            message: 'Exchange fetched successfully',
            exchange,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
