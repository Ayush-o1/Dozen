const { registerUser,loginUser } = require("../services/auth.service");

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

const login = async (req,res) => {
    try{
        const {email,password} = req.body;

        const result = await loginUser(email,password);

        res.status(200).json({
            success: true,
            message: "Login success",
            data: result,
        });
    }
    catch(error){
        if (error.message === "Invalid email or password"){
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }

        console.log(error);

        res.status(500).json({
            success:false,
            message:"Something went wrong",
        });
    }
};

module.exports = {
    register,
    login,
};