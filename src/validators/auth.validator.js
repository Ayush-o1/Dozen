const validateRegistration = (req,res,next) => {
    const {name,email,password} = req.body;

    if(!name || !name.trim()){
        return res.status(400).json({
            success: false,
            message: "Name is required",
        });
    }

    if(!email || !email.trim()){
        return res.status(400).json({
            success: false,
            message:"Email is required",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Invalid email format",
        });
    }

    if(!password){
        return res.status(400).json({
            success: false,
            message:"Password is required",
        });
    }

    if(password.length < 8){
        return res.status(400).json({
            success:false,
            message:"Password must be at least 8 characters",
        });
    }

    next();

};

const validateLogin = (req,res,next) => {
    const {email,password} = req.body;

    if(!email || !email.trim()){
        return res.status(400).json({
            success:false,
            message:"Email is required",
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Invalid email format",
        });
    }
    if(!password){
        return res.status(400).json({
            success:false,
            message:"Password is required",
        });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
};