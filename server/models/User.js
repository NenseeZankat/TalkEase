const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number], // Store embeddings as an array of numbers (for FAISS indexing)
  },
});

module.exports = mongoose.model("User", UserSchema);
