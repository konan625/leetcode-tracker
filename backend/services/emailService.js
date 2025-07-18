// services/emailService.js

const nodemailer = require("nodemailer");
const fetchLeetcodeStats = require("./fetchLeetcodeStats.prod");
const fetchTodaySubmissions = require("./fetchSubmissionCalender")
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

    //Compute "questions solved today"
    const todayDate = new Date().toISOString().split("T")[0]; //"YYYY-MM-DD"

    //Find yesterday's snapshot 
    const lastEntry = user.dailyStats[user.dailyStats.length - 1] || {};
    const yesterdayTotal = lastEntry.totalSolved || 0;
    const questionsToday = Math.max(0, stats.totalSolved - yesterdayTotal);

    //Append today's snapshot
    user.dailyStats.push({
      date: todayDate,
      totalSolved: stats.totalSolved,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
    });

    await user.save();

    // const todayCount = await fetchTodaySubmissions(user.leetcodeUsername)
    // if (!stats || stats.error) continue;

    // // Calculate today's solved by subtracting last total
    // const prevTotal = user.leetcodeStats?.totalSolved || 0;
    // const todaySolved = stats.totalSolved - prevTotal;

    // Build email HTML
    // const todayDate = new Date().toLocaleDateString('en-GB',{
    //   day:"2-digit",
    //   month:"short",
    //   year:"numeric"
    // });
    const html = `
        <h2>🧠 Your Daily LeetCode Report – ${todayDate}</h2>
        <p><strong>✅ Problems Solved Today:</strong> ${questionsToday}</p>
        <p>Keep up the momentum! 💪</p>
        <hr/>
        <h3>📊 Your Updated Stats:</h3>
        <ul>
          <li>Total Solved: ${stats.totalSolved}</li>
          <li>Easy: ${stats.easySolved}</li>
          <li>Medium: ${stats.mediumSolved}</li>
          <li>Hard: ${stats.hardSolved}</li>
        </ul>
    `;

    // Send email
    await transporter.sendMail({
      from: `"LeetCode Tracker" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "📈 Your Daily LeetCode Report",
      html
    });
    console.log(`✅ Email sent to ${user.email}`);

  }
}

module.exports = sendDailyEmails;
