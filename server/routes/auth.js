const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const faiss = require("faiss-node");
require("dotenv").config();

const router = express.Router();

// FAISS Index
const d = 128; // Dimension (adjust based on embeddings)
const index = new faiss.IndexFlatL2(d);

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, embedding } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, embedding });

    await user.save();

    if (embedding.length === d) {
      index.add(new Float32Array(embedding));
    }

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Find Similar Users using FAISS
router.post("/find-similar", async (req, res) => {
  try {
    const { embedding } = req.body;
    if (embedding.length !== d) return res.status(400).json({ msg: "Invalid embedding size" });

    const k = 5; // Number of closest users
    const distances = new Float32Array(k);
    const indices = new Int32Array(k);

    index.search(new Float32Array(embedding), k, distances, indices);

    res.json({ indices: Array.from(indices), distances: Array.from(distances) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
