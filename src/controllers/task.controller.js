const prisma = require("../config/prisma");
const { createTask , getAllTasks , getTaskById , updateTask, deleteTask } = require("../services/task.service");

const create = async (req, res,next) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate,
        } = req.body;

        const userId = req.user.userId;

        const task = await createTask(
            title,
            description,
            status,
            priority,
            dueDate,
            userId
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

const getAll = async (req, res, next) => {
    try {
        const ALLOWED_STATUSES = ["TODO", "IN_PROGRESS", "COMPLETED"];
        const ALLOWED_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
        const ALLOWED_SORT_FIELDS = ["createdAt", "updatedAt", "title", "dueDate"];

        const { status, priority, search, sort, page, limit } = req.query;

        // Validate status
        if (status && !ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}.`,
            });
        }

        // Validate priority
        if (priority && !ALLOWED_PRIORITIES.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: `Invalid priority. Allowed: ${ALLOWED_PRIORITIES.join(", ")}.`,
            });
        }

        // Parse sort: prefix "-" means descending, e.g. "-createdAt"
        let sortField = "createdAt";
        let sortOrder = "desc";
        if (sort) {
            const rawField = sort.startsWith("-") ? sort.slice(1) : sort;
            if (!ALLOWED_SORT_FIELDS.includes(rawField)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid sort field. Allowed: ${ALLOWED_SORT_FIELDS.join(", ")}.`,
                });
            }
            sortField = rawField;
            sortOrder = sort.startsWith("-") ? "desc" : "asc";
        }

        // Parse pagination
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        if (page !== undefined && (isNaN(parsedPage) || parsedPage < 1)) {
            return res.status(400).json({
                success: false,
                message: "page must be a positive integer.",
            });
        }

        if (limit !== undefined && (isNaN(parsedLimit) || parsedLimit < 1)) {
            return res.status(400).json({
                success: false,
                message: "limit must be a positive integer.",
            });
        }

        const currentPage = parsedPage || 1;
        const currentLimit = parsedLimit || 10;
        const skip = (currentPage - 1) * currentLimit;

        const { tasks, total } = await getAllTasks(req.user.userId, {
            status,
            priority,
            search,
            sortField,
            sortOrder,
            skip,
            take: currentLimit,
        });

        const totalPages = Math.ceil(total / currentLimit);

        res.status(200).json({
            success: true,
            pagination: {
                page: currentPage,
                limit: currentLimit,
                total,
                totalPages,
            },
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};


const getOne = async (req,res) => {
    try{
        const task = await getTaskById(req.params.id,req.user.userId);

        if(!task){
            return res.status(404).json({
                success: false,
                message:" Task not found",
            });
        }
        res.status(200).json({
            success:true,
            data: task,
        });
    }
    catch (error){
        console.error(error);

        res.status(500).json({
            success: false,
            message:"Something went wrong",
        });
    }
};

const update = async (req,res,next) =>{
    try{
        const {
            title,
            description,
            status,
            priority,
            dueDate,
        } = req.body;

        const task = await updateTask(req.params.id, req.user.userId, {
            title,
            description,
            status,
            priority,
            dueDate,
        });

        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found",
            });
        }

        res.status(200).json({
            success:true,
            message:"Task updated successfully",
            data: task,
        });
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            success:false,
            message:"Something went wrong",
        });
    }
};

const remove = async (req,res,next) => {
    try{

        const task = await deleteTask(req.params.id, req.user.userId);


        if(!task){
            return res.status(404).json({
                success:false,
                message:"TaSK NOT found",
            });
        }

        res.status(200).json({
            message: true,
            message:"Task deleted successfully",
            data: task,
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message:"Something went wrong",
        });
    }
};

module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove,
};