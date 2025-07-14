const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const DailyStatSchema = new mongoose.Schema({
    date: { type: String, required: true },           // e.g. "2025-07-07"
    totalSolved: { type: Number, default: 0 },
    easySolved: Number,
    mediumSolved: Number,
    hardSolved: Number
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    // solvedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], //this stpores an array of solvedQuestions (linked to Question.js)
    leetcodeUsername: { type: String, required: true, unique: true },
    dailyStats: [DailyStatSchema]

});

//Hash passwords before saving to database, below is a middleware function that runs automatically before a user document is saved to db
userSchema.pre("save", async function (next) { //pre("save".) this tells mongoose to run this function before the save operation
    if (!this.isModified("password")) return next(); // it checks if the password field has been modified,if not then skips hashing and oves to the next step
    const salt = await bcrypt.genSalt(10); //salt is a random data added to password before hasing ro make it more secure, gensalt generates a salt witrh complexity factor 10 , higher number make hashing slower
    this.password = await bcrypt.hash(this.password, salt);//actual password is being hashed, hashed password replaces the plain text passwords
    next(); //this tells mongoose to process with saving the document
});
module.exports = mongoose.model("User", userSchema);