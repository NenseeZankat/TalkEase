const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chat"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
