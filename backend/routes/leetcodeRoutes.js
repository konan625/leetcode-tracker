const express = require("express");
const router = express.Router();
const fetchLeetcodeStats = require("../services/fetchLeetcodeStats.prod");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /api/leetcode/stats - Get current user's LeetCode stats
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const stats = await fetchLeetcodeStats(user.leetcodeUsername);

        if (!stats || stats.error) {
            return res.status(500).json({ success: false, message: "Failed to fetch stats" });
        }

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;