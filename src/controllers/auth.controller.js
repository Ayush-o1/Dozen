const { registerUser } = require("../services/auth.service");

const register = async (req, res) => {
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
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

module.exports = {
    register,
};