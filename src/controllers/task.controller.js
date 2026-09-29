const prisma = require("../config/prisma");
const { createTask , getAllTasks , getTaskById , updateTask, deleteTask } = require("../services/task.service");

const create = async (req, res) => {
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

const getAll = async(req,res) => {
    try{
        const tasks = await getAllTasks();

        res.status(200).json({
            success: true,
            data: tasks,
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

const getOne = async (req,res) => {
    try{
        const task = await getTaskById(req.params.id);

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

const update = async (req,res) =>{
    try{
        const {
            title,
            description,
            status,
            priority,
            dueDate,
        } = req.body;

        const task = await updateTask(req.params.id, {
            title,
            description,
            status,
            priority,
            dueDate,
        });
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

const remove = async (req,res) => {
    try{

        const task = await deleteTask(req.params.id);

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