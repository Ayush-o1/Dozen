const express = require("express");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

// Serve the frontend from the public/ folder
app.use(express.static(path.join(__dirname, "../public")));

app.get("/",(req,res) => {
    res.json({
        success: true,
        message:"Task manager is running ✅",
    });
});

app.get("/health",(req,res) => {
    res.json({
        success: true,
        message: "API is healthy",
    });
});

app.use("/api/auth",authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);

module.exports = app;