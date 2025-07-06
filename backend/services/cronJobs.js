// services/cronJobs.js

const cron = require("node-cron");
const sendDailyEmails = require("./emailService");

// Schedule at 11 PM IST every day
cron.schedule(
    "0 23 * * *",
    // "*/5 * * * *",  // runs every minute
    async () => {
        console.log("🕒 Running daily email job...");
        try {
            await sendDailyEmails();
            console.log("✅ All emails dispatched.");
        } catch (err) {
            console.error("❌ Cron job error:", err);
        }
    },
    { timezone: "Asia/Kolkata" }
);

console.log("⏰ Cron job scheduled for 11 PM daily.");
