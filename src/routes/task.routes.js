const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { create , getAll , getOne, update, remove} = require("../controllers/task.controller");

const router = express.Router();

router.post("/",authenticate,create);
router.get("/",authenticate, getAll);
router.get("/:id",authenticate,getOne);
router.patch("/:id",authenticate,update);
router.delete("/:id",authenticate,remove);

module.exports = router;