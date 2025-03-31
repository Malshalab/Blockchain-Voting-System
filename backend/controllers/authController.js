const User = require('../models/User');  // Your Mongoose User model
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto'); // For generating a dummy password
const { ethers } = require('ethers'); // For linking ETH wallet to user account

// Create an instance of OAuth2Client using your backend's GOOGLE_CLIENT_ID.
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Link an Ethereum wallet to a user account.
 */
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

    // Verify signature
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: "Signature does not match address" });
    }

    // Update user's wallet
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

/**
 * Standard email/password registration.
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Email, password, and name must be entered correctly" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ error: "User already registered" });
    }
    const newUser = await User.create({ name, email, password });
    const payload = { id: newUser._id, email: newUser.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({
      message: "User successfully registered",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * Standard email/password login.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password not entered' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Email in request:', email);
      return res.status(401).json({ error: 'User does not exist' });
    }
    // Direct comparison for testing; in production use bcrypt.compare
    const comparePassword = password.trim() === user.password.trim();
    if (!comparePassword) {
      return res.status(401).json({ error: "User's password does not match" });
    }
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, walletAddress: user.walletAddress },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * Google registration.
 * Expects a request body: { token: "GOOGLE_ID_TOKEN" }.
 */
const googleRegister = async (req, res) => {
  try {
    console.log("Google Register Request Headers:", req.headers);
    console.log("Google Register Request Body:", req.body);

    const { token: googleToken } = req.body;
    if (!googleToken) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Verify the Google token.
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("Google token payload:", payload);

    const { email, name, sub: googleId } = payload;
    if (!email.endsWith('@torontomu.ca')) {
      return res.status(400).json({ error: 'Only @torontomu.ca emails are allowed' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already registered. Please log in.' });
    }

    // Generate a dummy password to satisfy schema requirements.
    const dummyPassword = crypto.randomBytes(16).toString('hex');
    const newUser = await User.create({ name, email, googleId, password: dummyPassword });
    const jwtPayload = { id: newUser._id, email: newUser.email };
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("User registered with Google:", newUser.email);
    return res.status(201).json({
      message: 'User successfully registered with Google',
      token: jwtToken,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Error during Google registration:', error);
    return res.status(500).json({ error: 'Google registration failed.' });
  }
};

/**
 * Google login.
 * Expects a request body: { token: "GOOGLE_ID_TOKEN" }.
 * Auto-registers the user if not found.
 */
const googleLogin = async (req, res) => {
  try {
    console.log("Google Login Request Headers:", req.headers);
    console.log("Google Login Request Body:", req.body);

    const { token: googleToken } = req.body;
    if (!googleToken) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("Google token payload:", payload);

    const { email, sub: googleId, name } = payload;
    if (!email.endsWith('@torontomu.ca')) {
      return res.status(400).json({ error: 'Only @torontomu.ca emails are allowed' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      console.log("User not found, auto-registering:", email);
      const dummyPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({ name, email, googleId, password: dummyPassword });
    }

    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
      console.log("Updated user with googleId:", googleId);
    }

    const jwtPayload = { id: user._id, email: user.email };
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("User logged in with Google:", user.email);
    return res.status(200).json({
      message: 'User logged in successfully with Google',
      token: jwtToken,
      user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error('Error during Google login:', error);
    return res.status(500).json({ error: 'Google login failed.' });
  }
};

module.exports = {
  register,
  login,
  linkWalletToUser,
  googleRegister,
  googleLogin,
};