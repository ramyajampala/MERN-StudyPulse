require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db").default;

const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});