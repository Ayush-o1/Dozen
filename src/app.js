const express = require("express");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(express.json());

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
module.exports = app;