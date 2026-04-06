const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getTasks, updateTaskStatus } = require("../controllers/taskController");

router.get("/", auth, getTasks);
router.put("/:id", auth, updateTaskStatus);

module.exports = router;