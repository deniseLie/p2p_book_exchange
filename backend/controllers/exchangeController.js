const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Exchange = require('../models/exchangeModel');

// Create exchange request
exports.createExchangeRequest = async (req, res) => {
    try {
        const { ownerUserID, ownerBookID } = req.body;
        const requesterUserID = req.user._id;
        console.log(req.body);
        console.log(req.user); 
        
        const { ObjectId } = require('mongoose').Types;

        // Validate requesterUserID
        if (!ObjectId.isValid(requesterUserID)) {
            return res.status(400).json({ message: 'Invalid requesterUserID' });
        }
        
        // Validate ownerUserID
        if (!ObjectId.isValid(ownerUserID)) {
            return res.status(400).json({ message: 'Invalid ownerUserID' });
        }

        // Ensure requester and owner are not the same
        if (requesterUserID.toString() === ownerUserID.toString()) {
            return res.status(400).json({ message: 'Requester and owner cannot be the same person' });
        }
        
        const requester = await User.findById(requesterUserID);
        const owner = await User.findById(ownerUserID);
        
        if (!requester || !owner) {
            return res.status(404).json({ message: 'User not found' });
        }
      
        // Check if each bookId in ownerBookID exists
        for (const bookId of ownerBookID) {
            if (!ObjectId.isValid(bookId)) {
                return res.status(400).json({ message: `Invalid bookId: ${bookId}` });
            }
        
            const bookExists = await Book.exists({ _id: bookId });
            if (!bookExists) {
                return res.status(404).json({ message: `Book with ID ${bookId} not found` });
            }
        }
    
        // Create a new exchange request
        const exchange = new Exchange({
            requesterUserID,
            ownerUserID,
            ownerBookID,
        });

        // Save the exchange and populate the related fields
        const savedExchange = await exchange.save();

        // Populate the saved exchange with full data
        const populatedExchange = await Exchange.findById(savedExchange._id)
            .populate('requesterUserID ownerUserID ownerBookID');
    
    
        res.status(201).json({
            message: 'Exchange request created successfully',
            exchange: populatedExchange,
        });
    } catch (err) {
      console.error(err?.message, err);
      res.status(500).json({ message: 'Server error' });
    }
};

// Update status of exchange request
exports.updateExchangeStatus = async (req, res) => {
    try {
        const { exchangeID, status } = req.body;
    
        // Validate status
        if (!['pending', 'denied', 'inprogress', 'halfApproved', 'canceled', 'completed'].includes(status)) {
            return res.status(400).json({ message: `Invalid status of ${status}` });
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


// Get all pending exchanges where the user is the book owner (requested by others)
exports.getPendingExchanges = async (req, res) => {
    try {
        // Get userId from the authenticated user
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing from the request' });
        }

        // Find all exchanges where the ownerUserID is the current user and status is 'pending'
        const exchanges = await Exchange.find({
            ownerUserID: userId,  // User is the owner of the book
            status: 'pending'     // Status is 'pending'
        })
        .populate('requesterUserID ownerUserID requesterBookID ownerBookID'); // Populate relevant fields

        if (!exchanges || exchanges.length === 0) {
            return res.status(201).json({ message: 'No pending exchanges found' });
        }

        return res.status(200).json({
            message: 'Pending exchanges fetched successfully',
            exchanges,
        });
    } catch (err) {
        console.error('Error fetching pending exchanges:', err);
        return res.status(500).json({ message: 'Server error' });
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

// Update the Requester's Book ID in an exchange
exports.updateRequesterBookID = async (req, res) => {
    try {
      const { exchangeID, requesterBookID } = req.body;
  
      // Validate that requesterBookID is an array of ObjectIds (or a single ObjectId)
      if (!requesterBookID || (Array.isArray(requesterBookID) && requesterBookID.length === 0)) {
        return res.status(400).json({ message: 'Requester book ID is required' });
      }
  
      // Find the exchange by ID
      const exchange = await Exchange.findById(exchangeID);
  
      if (!exchange) {
        return res.status(404).json({ message: 'Exchange not found' });
      }
  
      // Update the requesterBookID field with the new book(s)
      exchange.requesterBookID = requesterBookID;
  
      // Update the updatedAt field
      exchange.updatedAt = Date.now();
  
      // Save the updated exchange document
      const updatedExchange = await exchange.save();
  
      res.status(200).json({
        message: 'Requester Book ID updated successfully',
        exchange: updatedExchange,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  