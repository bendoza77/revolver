const express    = require("express");
const { chat }   = require("../controllers/ai.controller");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.post("/chat", catchAsync(chat));

module.exports = router;
