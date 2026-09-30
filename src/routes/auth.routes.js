const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { validateRegistration,validateLogin } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register",validateRegistration, register);
router.post("/login",validateLogin, login);

router.get("/test", authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authentication successful",
        user: req.user,
    });
});

module.exports = router;