const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// @route   POST /api/auth/signup
// @desc    Register new user & return JWT
// @access  Public
exports.signup = async (req, res) => {
  // 1. Validate incoming data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, leetcodeUsername } = req.body;

  try {
    // 2. Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Create & save user (password gets hashed via pre-save hook)
    const user = new User({ name, email, password, leetcodeUsername });
    await user.save();

    // 4. Issue JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ success: true, token, userId: user._id });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT
// @access  Public
exports.login = async (req, res) => {
  // 1. Validate incoming data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 2. Fetch user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Issue JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, userId: user._id });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
