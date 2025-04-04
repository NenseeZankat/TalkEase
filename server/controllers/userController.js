import bcrypt from "bcryptjs";
import User from "../models/User.js";
import faiss from "faiss-node";

const d = 128; // Dimension (adjust based on embeddings)
const index = new faiss.IndexFlatL2(d);

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({ msg: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Find Similar Users using FAISS
export const findSimilarUsers = async (req, res) => {
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
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password, embedding } = req.body;
    const { id } = req.params;

    let user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (email) user.email = email;
    if (name) user.name = name;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (embedding && embedding.length === d) {
      user.embedding = embedding;

      // Update FAISS index
      index.remove(user.embedding);
      index.add(new Float32Array(embedding));
    }

    await user.save();

    res.json({ msg: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Find User by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
