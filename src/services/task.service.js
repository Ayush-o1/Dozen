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
}
const getAllTasks = async () => {
    const tasks = await prisma.task.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return tasks;
};

const getTaskById = async(id) => {
    const task = await prisma.task.findUnique({
        where: {
            id: Number(id),
        },
    });
    return task;
};

const updateTask = async(id,data) => {
    const task = await prisma.task.update({
        where: {
            id: Number(id),
        },
        data,
    });

    return task;
};

const deleteTask = async(id) => {
    const task = await prisma.task.delete({
        where: {
            id:Number(id),
        },

    })

    return task;
};


module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};