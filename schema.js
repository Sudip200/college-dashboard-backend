
const mongoose = require('mongoose');

const resulSchema = new mongoose.Schema({
    sl: Number,
    ROLL: Number,
    NAME: String,
    BSCH201: String,
    BSM201: String,
    ESCS201: String,
    HMHU201: String,
    BSCH291: String,
    ESCS291: String,
    ESME291: String,
    HMHU291: String,
    SGPA1: Number,
    SGPA2: Number,
    YGPA: String,
    DGPA: String,  // Allow "N/A" as a string
    SEMETER: String,
    OVERAL: String,
    MAR: Number
});
const PlaceMentSchema = new mongoose.Schema({
    ROLL: Number,
    NAME: String,
    Gender: String,
    MOBILE: Number,
    Company: String,
    Salary: String,
    Post: String
});
const courseSchema = new mongoose.Schema({
    Name: String,
    Code: String,
    Credit: Number,
    Year: Number,
    Semester: Number,
    Program:String,
    Stream:String,
})
const AttendenceSchema = new mongoose.Schema({
    ROLL: Number,
    CourseCode: String,
    TotalClasses: Number,
    ClassesAttended: Number,
    Date: { type: Date, default: Date.now }

})

const Result = mongoose.model('Result', resulSchema);
const PlaceMent = mongoose.model('PlaceMent', PlaceMentSchema);
const Course = mongoose.model('Course', courseSchema);
const Attendence = mongoose.model('Attendence', AttendenceSchema);
module.exports = {
    Result,
    PlaceMent,
    Course,
    Attendence
}