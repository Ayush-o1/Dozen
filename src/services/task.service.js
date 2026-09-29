const prisma = require("../config/prisma");

const createTask = async (
    title,
    description,
    status,
    priority,
    dueDate,
    userId
) => {
    const task = await prisma.task.create({
        data: {
            title,
            description,
            status,
            priority,
            dueDate,
            userId,
        },
    });

    return task;
};

const getAllTasks = async (userId) => {
    const tasks = await prisma.task.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return tasks;
};

const getTaskById = async (id, userId) => {
    const task = await prisma.task.findFirst({
        where: {
            id: Number(id),
            userId,
        },
    });

    return task;
};

const updateTask = async (id, userId, data) => {
    const existingTask = await prisma.task.findFirst({
        where: {
            id: Number(id),
            userId,
        },
    });

    if (!existingTask) {
        return null;
    }

    const task = await prisma.task.update({
        where: {
            id: Number(id),
        },
        data,
    });

    return task;
};

const deleteTask = async (id,userId) => {
    const existingTask = await prisma.task.findFirst({
        where:{
            id: Number(id),
            userId,
        },
    });

    if(!existingTask){
        return null;
    }

    const task = await prisma.task.delete({
        where: {
            id: Number(id),
        },
    });

    return task;
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};