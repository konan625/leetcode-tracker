const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const User = require("../models/User");


//calling the authentication middleware here
const authMiddleware = require("../middleware/authMiddleware");
//This code defines an Express router with two routes for managing solved questions in a system (e.g., a LeetCode tracker). It uses Mongoose models (Question and User) to interact with a MongoDB database.

//Adding a solved question (after authenticated)
router.post("/add", async (req, res) => {
    try {
        const { userID, title, difficulty, link } = req.body;
        const question = new Question({ userId, title, difficulty, link });
        await question.save();

        await User.findByIdAndUpdate(userId, { $push: { solvedQuestions: question._id } });

        res.status(201).json({ success: true, message: "Question added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Get all solved questions for a user
router.get("/:userID", async (req, res) => {
    try {
        const quesions = await Question.find({ userID: req.params.userId }).sort({ dateSolved: -1 });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router