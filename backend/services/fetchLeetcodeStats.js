const axios = require("axios")

const fetchLeetcodeStats = async (leetcodeUsername) => {
    const query  = ` 
    {
        matchedUser(username: "${leetcodeUsername}"){
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
        }
    }
    `

    try {
        const response = await axios.post("https://leetcode/garphql",{query})

        const stats = response.data.data.matchedUser.submitStats.acSubmissionNum;

        let report = "Your Leetcode Progress Today: \n"
        stats.forEach(item => {
            if(item.difficulty !=="All"){
                report += `${item.difficulty}: ${item.count} solved\n`
            }
        })

        return report
    } catch (error) {
        console.error("Error fetching leetcode stats:",error);
        return "Could not fetch Leetcode data"
    }
}

module.exports = fetchLeetcodeStats