const User = require('../models/User');  // Your user model (Mongoose model)
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// For linking ETH wallet to user account
const { ethers } = require('ethers');

const linkWalletToUser = async (req, res) => {
  const { address, message, signature } = req.body;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ✅ Verify signature
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: "Signature does not match address" });
    }

    // ✅ Update user's wallet
    const user = await User.findByIdAndUpdate(
      userId,
      { walletAddress: address },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      success: true,
      message: "Wallet linked successfully",
      user: { id: user._id, walletAddress: user.walletAddress },
    });

  } catch (err) {
    console.error("Wallet linking error:", err);
    return res.status(500).json({ error: "Server error linking wallet" });
  }
};

// Register API Call
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate that name, email, and password are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Email, password, and name must be entered correctly" });
    }

    // Validate that email is not already in system
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ error: "User already registered" });
    }

    // Create the new user using values from req.body
    const newUser = await User.create({ name, email, password });

    // Prepare payload with user details (excluding password for security)
    const payload = { id: newUser._id, email: newUser.email };

    // Generate JWT using the secret from environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      message: "User successfully registered",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password not entered' });
    }

    // Retrieve the user document from the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Email in request:', email);
      return res.status(401).json({ error: 'User does not exist' });
    }

    // Debug logging of password values (for development purposes)
    console.log('Password from request:', password);
    console.log('Password from DB:', user.password);
    console.log('Types:', typeof password, typeof user.password);

    // Direct password comparison for testing purposes (in production, use bcrypt.compare)
    const comparePassword = password.trim() === user.password.trim();
    if (!comparePassword) {
      return res.status(401).json({ error: "User's password does not match" });
    }

    // Create payload with user details
    const payload = { id: user._id, email: user.email };

    // Generate JWT using the secret from environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { register, login, linkWalletToUser };