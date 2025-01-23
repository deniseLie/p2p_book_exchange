const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import your custom modules
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For JSON body parsing
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Connection URI from the environment variable
const mongoURI = process.env.MONGO_URI; // Load from environment variable

// Ensure the URI is loaded correctly
if (!mongoURI) {
  console.error("MongoDB URI is not set in the environment variables.");
  process.exit(1); // Exit the application if URI is not set
}

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
