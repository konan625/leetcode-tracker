const mongoose = require("mongoose");

// An asynchronous function always returns a Promise. If the function returns a value, the Promise will be resolved with that value. If the function throws an error, the Promise will be rejected with that error.
const connectDB = async () => {
    // Arrow functions provide a concise way to write functions and do not have their own this context (they inherit this from the surrounding scope).
    // Since it is declared with async, it can use the await keyword inside its body to wait for asynchronous operations (like database connections) to complete.
    console.log("🔍 MongoDB URL:", process.env.MONGO_URL);
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected");
    }
    catch(error){
        console.error("❌ MongoDB Connection Failed",error);
        process.exit(1);
    }

};

// Connect to MongoDB
module.exports = connectDB;
// The line module.exports = connectDB; is used in Node.js to export the connectDB function so that it can be imported and used in other files. This is part of Node.js's module system, which allows you to organize code into reusable modules.