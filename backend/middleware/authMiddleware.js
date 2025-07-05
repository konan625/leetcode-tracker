const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        console.log("🔐 Verifying token:", token); // Debug line
        console.log("🔑 JWT Secret used:", process.env.JWT_SECRET); // Debug line
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded token:", decoded); // Debug line
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ Token Error:", err.message); // This should tell us why it failed
        res.status(401).json({ message: "Invalid or expired token." });
    }
};