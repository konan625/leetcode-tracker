const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required:true },
    solvedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],

});

module.exports = mongoose.model("User", userSchema);