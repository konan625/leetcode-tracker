//this middleware is a jwt authentication guard, that checks if a request has a valid token before allowing it to access to protected routes.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization"); //this looks for a token in the authorization header of the request
    if (!token) return res.stats(401).json({ message: "Access denied. No token provided" }); //this is a token check

    try {
        const decoded = jwt .verify(token, process.env.JWT_SECRET);// uses the server's jwt_secret key to verify the token's authenticity, if valid decoded contains the payload in json
        next(); //if verification succeeds the request proceeds to the protected route
    } catch (err){
        res.status(401).json({message:"Invalid token."});
    }
};