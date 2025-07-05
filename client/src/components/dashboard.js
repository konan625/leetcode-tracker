import React from "react";

const Dashboard = () => {
    return (
        <div style={styles.container}>
            <h2>🎉 You're All Set!</h2>
            <p>You've successfully signed up for the LeetCode Tracker.</p>
            <p>Your daily progress report will be delivered to your inbox at 11 PM every day.</p>
            <p>Thank you for joining us!</p>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "auto",
        padding: "2rem",
        textAlign: "center"
    }
};

export default Dashboard;