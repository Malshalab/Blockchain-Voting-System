const express = require('express');
const router = express.Router();

const { 
  login, 
  register, 
  linkWalletToUser,
  googleRegister,
  googleLogin 
} = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/link-wallet', linkWalletToUser);

// Google authentication endpoints
router.post('/google/register', googleRegister);
router.post('/google/login', googleLogin);

module.exports = router;