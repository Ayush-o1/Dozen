const { registerUser, loginUser } = require("../services/auth.service");

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await registerUser(name, email, password);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        if (error.message === "Email already registered") {
            error.statusCode = 409;
        }

        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        if (error.message === "Invalid email or password") {
            error.statusCode = 401;
        }

        next(error);
    }
};

module.exports = {
    register,
    login,
};