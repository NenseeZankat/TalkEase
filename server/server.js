import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import chatrouter from "./routes/chatRoutes.js";
import userrouter from "./routes/userRoutes.js";
import dotenv from "dotenv";
import ChatHistory from "./models/ChatHistory.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userrouter);
app.use("/api/chat", chatrouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server running on ${url}`);
});
