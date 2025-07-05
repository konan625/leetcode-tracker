const axios = require("axios");

/**
 * Fetches LeetCode stats using public GraphQL API
 */
const fetchLeetcodeStats = async (leetcodeUsername) => {
    if (!leetcodeUsername) return null;

    const query = `
    {
        matchedUser(username: "${leetcodeUsername}") {
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
        }
    }
    `.trim();

    try {
        const response = await axios.post("https://leetcode.com/graphql ", { query });

        const data = response.data.data.matchedUser.submitStats.acSubmissionNum;

        let easy = 0, medium = 0, hard = 0, total = 0;

        data.forEach((item) => {
            if (item.difficulty === "Easy") easy = item.count;
            if (item.difficulty === "Medium") medium = item.count;
            if (item.difficulty === "Hard") hard = item.count;
            if (item.difficulty === "All") total = item.count;
        });

        return {
            totalSolved: total,
            easySolved: easy,
            mediumSolved: medium,
            hardSolved: hard
        };

    } catch (error) {
        console.error("❌ Error fetching LeetCode stats:", error.message);
        return {
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            todaySolved: 0,
            error: true
        };
    }
};

module.exports = fetchLeetcodeStats;