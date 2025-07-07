// services/fetchSubmissionCalendar.js
const axios = require("axios");

async function fetchTodaySubmissions(username) {
    const query = `
    query userCalendar($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          submissionCalendar
        }
      }
    }
  `;

    const res = await axios.post(
        "https://leetcode.com/graphql",
        { query, variables: { username } },
        { headers: { "Content-Type": "application/json" } }
    );

    const rawCal = res.data.data.matchedUser?.userCalendar?.submissionCalendar;
    if (!rawCal) throw new Error("No submission calendar data");

    const calendar = JSON.parse(rawCal);
    const todayEpoch = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    return calendar[todayEpoch] || 0;
}

module.exports = fetchTodaySubmissions;
