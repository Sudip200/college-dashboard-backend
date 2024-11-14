
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

const Result = mongoose.model('Result', resulSchema);
const PlaceMent = mongoose.model('PlaceMent', PlaceMentSchema);
module.exports = {
    Result,
    PlaceMent

}