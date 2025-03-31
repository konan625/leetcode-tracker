const cron = require("node-cron");
const User = require("../models/User")
const sendEmail = require("./emailService")
const fetchLeetcodeStats = require("./fetchLeetcodeStats")

cron.schedule("0 23 * * *", async () => {
    console.log("Running Scheduled job: Fetching Leetcode stats and sending emails...")

    try {
        const users = await User.find({})
        for (let user of users) {
            const stats = await fetchLeetcodeStats(user.leetcodeUsername)
            await sendEmail(user.email, "Daily Leetcode Progress Report", stats);
        }

        console.log("Emails sent to all registered users")
    } catch (error) {
        console.error("Error running schedules jobs", error)
    }

}, {
    timezone: "Asia/Kolkata"
})

console.log("✅ Cron job scheduled for 11 PM daily.");