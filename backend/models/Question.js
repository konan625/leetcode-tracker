//Mongoose is a Node.js library that provides a schema-based solution for modeling and interacting with MongoDB databases.
const mongoose=require("mongoose")

//This code defines a Mongoose schema for a Question model
const questionSchema = new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},//ref :"user" user is anotehr model
    title:{type: String,required:true},
    difficulty:{type: String,enum:["Easy","Medium","Hard"],required:true},
    link: {type:String,required:true},
    dateSolved:{type:Date, default:Date.now}
})

module.exports = mongoose.model("Question",questionSchema)