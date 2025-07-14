const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/tasks', require('./routes/tasks'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});