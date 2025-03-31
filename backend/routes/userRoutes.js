const express = require('express')
const router = express.Router()
const User = require("../models/User")
const authMiddleware = require("../middleware/authMiddleware")

//update user's leetcode username
router.post(
    "/set-leetcode", authMiddleware, async (req, res) => {
        const { leetcodeUsername } = req.body;
        if (!leetcodeUsername) {
            return res.status(400).json({ sucess: false, message: "User not found" });
        }

        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            user.leetcodeUsername = leetcodeUsername;
            await user.save();

            res.json({ success: true, message: "LeetCode username set successfully!" });

        } catch (error) {
            res.status(500).json({ sucess: false, message: "server-error" })
        }

    }
)

module.exports = router