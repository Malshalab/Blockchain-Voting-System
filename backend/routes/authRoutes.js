// Import the Express module
const express = require('express');

// Create a new router instance
const router = express.Router();

// Import the login controller function
// You can import additional functions (e.g., register) if needed
const { login } = require('../controllers/authController');

// Define the POST /login endpoint
// When a POST request is made to /auth/login, the login controller is executed
router.post('/login', login);


module.exports = router;
