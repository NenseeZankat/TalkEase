const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  embedding: { type: [Number], default: [] }, // Vector for FAISS
});

module.exports = mongoose.model("User", UserSchema);
