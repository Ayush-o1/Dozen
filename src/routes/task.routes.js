const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { create , getAll , getOne, update, remove} = require("../controllers/task.controller");
const {
    validateCreateTask,
    validateUpdateTask,
    validateTaskId,
} = require("../validators/task.validator");

const router = express.Router();

router.post("/",authenticate,validateCreateTask,create);
router.get("/",authenticate, getAll);
router.get("/:id",authenticate,validateTaskId,getOne);
router.patch(
    "/:id",
    authenticate,
    validateUpdateTask,
    validateTaskId,
    update
);
router.delete("/:id",authenticate,validateTaskId,remove);

module.exports = router;