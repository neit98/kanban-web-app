const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { verifyToken } = require('../middleware/auth');

const User = require('../models/User');

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Missing email and/or password' });

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Email is incorrect' });
  }

  if (!validator.isStrongPassword(password)) {
    return res
      .status(400)
      .json({ success: false, message: 'Password is not strong enough' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'email already taken' });

    // All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: 'User created successfully',
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Missing email and/or password' });

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Email is incorrect' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password' });

    // Username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect email or password' });

    // All good
    // Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: 'User logged in successfully',
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
