// Import dependencies
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const fetchLeetcodeStats = require("./fetchLeetcodeStats.prod");
const User = require("../models/User");
const connectDB = require("../config/db");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Setup transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Main function
const sendEmail = async () => {
    try {
        const users = await User.find();

        for (const user of users) {
            const stats = await fetchLeetcodeStats(user.leetcodeUsername);
            if (!stats || stats.error) continue;

            const htmlContent = `
                <h2>Hello ${user.name},</h2>
                <p>Here are your LeetCode stats for today:</p>
                <ul>
                    <li><strong>Total Solved Today:</strong> ${stats.todaySolved}</li>
                </ul>
                <p>🔥 Keep up the streak! You got this 💪</p>
            `;

            await transporter.sendMail({
                from: "LeetCode Tracker <b03061679@gmail.com>",
                to: user.email,
                subject: "📈 Daily Progress Report",
                html: htmlContent
            });

            console.log(`✅ Email sent to ${user.email}`);
        }

    } catch (error) {
        console.error("❌ Error sending emails:", error.message);
    }
};

// Test run
sendEmail();
module.exports = sendEmail;