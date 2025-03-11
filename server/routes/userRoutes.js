const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Register User
router.post("/register", userController.registerUser);

// Login User
router.post("/login", userController.loginUser);

// Find Similar Users
router.post("/find-similar", userController.findSimilarUsers);

// Update User
router.put("/update/:id", userController.updateUser);

// Fetch All Users
router.get("/all-users", userController.getAllUsers);

// Find User by ID
router.get("/user/:id", userController.getUserById);

module.exports = router;
