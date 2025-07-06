// services/emailService.js

const nodemailer = require("nodemailer");
const fetchLeetcodeStats = require("./fetchLeetcodeStats.prod");
const User = require("../models/User");

// Configure transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Fetches stats for each user, sends them an email, and updates their record.
 */
async function sendDailyEmails() {
  const users = await User.find({});
  for (let user of users) {
    const stats = await fetchLeetcodeStats(user.leetcodeUsername);
    if (!stats || stats.error) continue;

    // Calculate today's solved by subtracting last total
    const prevTotal = user.leetcodeStats?.totalSolved || 0;
    const todaySolved = stats.totalSolved - prevTotal;

    // Build email HTML
    const html = `
      <h2>Hello ${user.name},</h2>
      <p>Your solved count for today: <strong>${todaySolved}</strong></p>
      <ul>
        <li>Easy: ${stats.easySolved - (user.leetcodeStats?.easy || 0)}</li>
        <li>Medium: ${stats.mediumSolved - (user.leetcodeStats?.medium || 0)}</li>
        <li>Hard: ${stats.hardSolved - (user.leetcodeStats?.hard || 0)}</li>
      </ul>
      <p>Keep up the streak! 🚀</p>
    `;

    // Send email
    await transporter.sendMail({
      from: `"LeetCode Tracker" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "📈 Your Daily LeetCode Report",
      html
    });
    console.log(`✅ Email sent to ${user.email}`);

    // Update DB stats
    user.leetcodeStats = {
      totalSolved: stats.totalSolved,
      easy: stats.easySolved,
      medium: stats.mediumSolved,
      hard: stats.hardSolved
    };
    user.lastSyncedAt = new Date();
    await user.save();
  }
}

module.exports = sendDailyEmails;
