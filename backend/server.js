//Main Entry File

//Importing Dependencies
const express = require("express"); //node js framework
const dotenv = require("dotenv"); //loads env variables from .env file into process.env
const cors = require("cors"); //middleware that enables cross-origin resource sharing (CORS), allowing the server to handle requests from different origins (frontend)
const connectDB = require("./config/db"); //

dotenv.config(); //loads the snv variables from a .env file into the process.env object
console.log("🔍 MongoDB URL:", process.env.MONGO_URL); // Debugging line
connectDB();

const app = express(); //an instance of express application, The app object is used to define routes, middleware, and start the server.
app.use(cors()); //Enables CORS for all routes, allowing the API to be accessed from different domains (e.g., a frontend application running on http://localhost:3000).
app.use(express.json()); // Parses incoming requests with JSON payloads. This middleware makes the request body available under req.body.

//Defining a route
//This defines a GET route for the root URl (/), when the user will visit a root url http://localhost:5000/ ther server responds with this msg, req -> reuest object containing info about http request, res-> response object to send response back to client

//Import routes

const authRoutes = require("../backend/routes/authRoutes")
const questionRoutes = require("../backend/routes/questionRoutes");
const userRoutes = require("../backend/routes/userRoutes")
const cronJobs = require("../backend/services/cronJobs")
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/user",userRoutes)

app.get("/", (req, res) => {
    res.send("Leetcode Tracker API is running");
});

//Setting the port -> this sets the port for the server to listen on
const PORT = process.env.PORT || 5000;

//Starting the server -> makes it listen on the PORT, once its running it will show this msg
app.listen(PORT, () => {
    console.log(`🚀Server is running on port ${PORT}`);
});
