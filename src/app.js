const express = require("express");

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

module.exports = app;