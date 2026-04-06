const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createPlan } = require("../controllers/planController");

router.post("/create", auth, createPlan);

module.exports = router;