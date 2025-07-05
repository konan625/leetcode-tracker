const puppeteer = require("puppeteer");

const fetchLeetcodeStats = async (leetcodeUsername) => {
    if (!leetcodeUsername) return null;

    const url = `https://leetcode.com/${leetcodeUsername}/`;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Optional: Set viewport and user agent
    await page.setUserAgent("Mozilla/5.0");
    await page.setViewport({ width: 1200, height: 800 });

    try {
        // Go to profile page
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        const furl = await page.url();
        console.log("🌐 Loaded URL:", furl);

        if (furl.includes("login")) {
            console.warn("⚠️ Redirected to login page — rate limited or blocked?");
        }
        //Check is its a 404 page
        // Check if it's a 404 page
        const is404 = await page.evaluate(() => {
            const h1 = document.querySelector("h1");
            return h1 && h1.innerText.includes("Page not found");
        });

        if (is404) {
            console.warn(`⚠️ User ${leetcodeUsername} not found`);
            await browser.close();
            return {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                todaySolved: 0,
                error: true
            };
        }
        // Check if user exists
        const isUserExist = await page.$(".text-label-1") !== null;
        if (!isUserExist) {
            console.warn(`⚠️ User ${leetcodeUsername} not found`);
            await browser.close();
            return {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                todaySolved: 0,
                error: true
            };
        }

        // Wait for stats section
        await page.waitForSelector(".text-label-2", { timeout: 15000 });

        await page.screenshot({ path: 'leetcode-profile.png' });
        // Scrape stats
        const stats = await page.evaluate(() => {
            const solvedElements = Array.from(document.querySelectorAll(".text-sd-foreground.text-xs.font-medium"));

            // const allSolved = parseInt(solvedElements[0]?.innerText || "0");
            const easySolved = parseInt(solvedElements[0]?.innerText || "0");
            const mediumSolved = parseInt(solvedElements[1]?.innerText || "0");
            const hardSolved = parseInt(solvedElements[2]?.innerText || "0");

            return {
                totalSolved: easySolved+mediumSolved+hardSolved,
                easySolved,
                mediumSolved,
                hardSolved,
                todaySolved: 0 // Will improve later
            };
        });

        await browser.close();
        return stats;

    } catch (error) {
        console.error("❌ Error fetching LeetCode stats:", error.message);
        await browser.close();
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