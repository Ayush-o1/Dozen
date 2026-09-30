const allowedStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"];
const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

const validateCreateTask = (req, res, next) => {
    const {
        title,
        description,
        status,
        priority,
        dueDate,
    } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            success: false,
            message: "Title is required",
        });
    }

    if (description !== undefined && typeof description !== "string") {
        return res.status(400).json({
            success: false,
            message: "Description must be a string",
        });
    }

    if (status !== undefined && !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status",
        });
    }

    if (priority !== undefined && !allowedPriorities.includes(priority)) {
        return res.status(400).json({
            success: false,
            message: "Invalid priority",
        });
    }

    if (dueDate !== undefined && isNaN(Date.parse(dueDate))) {
        return res.status(400).json({
            success: false,
            message: "Invalid dueDate",
        });
    }

    next();
};

const validateUpdateTask = (req, res, next) => {
    const {
        title,
        description,
        status,
        priority,
        dueDate,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required",
        });
    }

    if (title !== undefined && (!title || !title.trim())) {
        return res.status(400).json({
            success: false,
            message: "Title cannot be empty",
        });
    }

    if (description !== undefined && typeof description !== "string") {
        return res.status(400).json({
            success: false,
            message: "Description must be a string",
        });
    }

    if (status !== undefined && !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status",
        });
    }

    if (priority !== undefined && !allowedPriorities.includes(priority)) {
        return res.status(400).json({
            success: false,
            message: "Invalid priority",
        });
    }

    if (dueDate !== undefined && isNaN(Date.parse(dueDate))) {
        return res.status(400).json({
            success: false,
            message: "Invalid dueDate",
        });
    }

    next();
};

const validateTaskId = (req,res,next) => {
    const taskId = Number(req.params.id);

    if(!Number.isInteger(taskId) || taskId <= 0){
        return res.status(400).json({
            success:false,
            message:"Invalid task Id",
        });
    }
    next();
};

module.exports = {
    validateCreateTask,
    validateUpdateTask,
    validateTaskId,
};