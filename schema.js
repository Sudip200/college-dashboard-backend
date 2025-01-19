
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
    Post: String,
    Year: Number,
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
    Date:String

})
const CourseAttendenceSchema = new mongoose.Schema({
  CourseCode:String,
  StudentId:String,
  Status:String,
  Date:String
})
const CourseDataSchema= new mongoose.Schema({
    CourseCode:String,
    Date:String
})
const FacultySchema = new mongoose.Schema({
    Department:String,
    Name:String,
    Qualification:String,
    Specialization:String,
    Designation:String,
   
})
const NotificationSchema = new mongoose.Schema({
    Title:String,
    Description:String,
    Date:String
})


const Result = mongoose.model('Result', resulSchema);
const PlaceMent = mongoose.model('PlaceMent', PlaceMentSchema);
const Course = mongoose.model('Course', courseSchema);
const Attendence = mongoose.model('Attendence', AttendenceSchema);
const CourseAttendence= mongoose.model('CourseAttendence',CourseAttendenceSchema);
const CourseData= mongoose.model('CourseData',CourseDataSchema)
const Faculty= mongoose.model('Faculty',FacultySchema)
const Notification= mongoose.model('Notification',NotificationSchema)
module.exports = {
    Result,
    PlaceMent,
    Course,
    Attendence,
    CourseAttendence,
    CourseData,
    Faculty,
    Notification
}