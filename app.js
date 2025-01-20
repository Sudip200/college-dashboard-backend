const express = require('express');
const mongoose = require('mongoose');
const { Result ,PlaceMent,Course, Attendence,CourseAttendence,CourseData, Faculty,Notification} = require('./schema');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const faculty = require('./data/faculty')
const app = express();

const csvtojson = require('csvtojson');
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path to your CSV file
const filePath = path.join(__dirname, 'data/2023.csv');

dotenv.config();

// Connect to MongoDB 
mongoose.connect('mongodb+srv://college:1234@cluster0.hz78q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(express.static('public'));
app.use(cors( {origin: process.env.CLIENT_ROUTE, credentials: true})); 
app.get('/', (req, res) => {
    res.send('Hello World');
});
//functions 
const uploadCsvDataToMongoDB = async () => {
    try {
        const jsonArray = await csvtojson().fromFile(filePath);
        
        console.log(jsonArray);
    await PlaceMent.insertMany(jsonArray);
        console.log('CSV data successfully uploaded to MongoDB');
    } catch (err) {
        console.error('Error uploading CSV data:', err);
    }
};
const verifyToken = (req,res,next)=>{
     if(!req.headers.cookie){
        res.send('You are not authenticated');
    }
    const token = req.headers.cookie.split('=')[1];
   
    if(!token){
        res.send('You are not authenticated');
    }else{
        jsonwebtoken.verify(token,process.env.JSON_KEY,(err,data)=>{
            if(err){
                res.send('You are not authenticated');
            }else{
                next();
            }
        }) 
    } 
}



// Call the function to upload data
app.get('/upload-csv-data', async (req, res) => {
    await uploadCsvDataToMongoDB();
    res.send('Data uploaded successfully');
});
app.get('/results' ,async (req, res) => {
  
    const results = await Result.find();
    res.send(results);
});
app.get('/courses', async (req, res) => {
        
        const results = await Course.find();
        res.send(results);
    });
app.get('/2023-placement', async (req, res) => {
    
    const results = await PlaceMent.find();
    res.send(results);
});
app.post('/createnotification', async (req, res) => {
    const {Title,Description,Date} = req.body;
    console.log(Title)
    try{
        if(Title =='' || Description =='' || Date == ''){
            res.send('Please fill out all form');
        }else{
            const newNotification = new Notification({Title:Title,Description:Description,Date:Date});
            newNotification.save();
            res.send('saved')
        } 
    }catch(e){
        res.send(e)

    } 
});
app.get('/notifications', async (req, res) => {
    const allnotices = await Notification.find();
    res.send(allnotices);
});

   








app.post('/attend', async (req, res) => {
   const {CourseCode,ROLL,Date,Status} = req.body;
   try{
       if(CourseCode =='' || ROLL =='' || Date == ''|| Status == ''){
        res.send('Please fill out all form');
       }else{
        const newAttendence = new CourseAttendence({CourseCode:CourseCode,Date:Date,Status:Status,StudentId:ROLL});
        newAttendence.save();
        res.send('saved')
       }
   }catch(e){
    res.send(e)
   }

     
});
app.get('/faculty',async (req, res) => {
    
    const results = await Faculty.find();
    res.send(results);
});
app.get('/attendence', async (req, res) => {
        const {Date,CourseCode}= req.query;
        const results = await CourseAttendence.find({Date:Date,CourseCode:CourseCode});
        res.send(results);
    });
app.post('/login', async (req,res)=>{
    const {email,password}= req.body;
    console.log(req.body);
    if(email=='' || password==''){
        res.send('Please enter all fields');
    }else{
       
        if(email=='biswa@1' && password =='123'){
              console.log(1);
        const user = {email:email};
        const accessToken = jsonwebtoken.sign(user,process.env.JSON_KEY);
        res.cookie('token', accessToken, { httpOnly: true, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24, domain: process.env.CLIENT_ROUTE, secure: true });
        res.json({accessToken:accessToken});
        }else{
            res.send('Email or password is incorrect');
        }    
}
})

app.post('/checkifexist', async (req,res)=>{
    const {CourseCode,Date} = req.body;
    const attendence = await Attendence.find({CourseCode:CourseCode,Date:Date});
    if(attendence.length>0){
        res.send(attendence);
    }else{
        res.send('created');
    }

})
app.get('/individualattendence', async (req,res)=>{
    const {CourseCode,ROLL} = req.query;
    const attendence = await CourseAttendence.find({CourseCode:CourseCode,StudentId:ROLL});
    console.log(attendence);
    const coursedata = await CourseData.find({CourseCode:CourseCode});
    totalClass = coursedata.length;
    let present = 0;
    attendence.map((data)=>{
        if(data.Status=='present'){
            present++;
        }
    })
    let percentage = (present/totalClass)*100;
    res.send({totalClass,present,percentage});
}
)
app.post('/createclass',async (req,res)=>{
    const {CourseCode,Date}=req.body;
    const coursedata= await CourseData.findOne({CourseCode:CourseCode,Date:Date});
    if(coursedata){
        res.send('created');
      
    }else{
        const newCourseData = new CourseData({CourseCode:CourseCode,Date:Date});
        newCourseData.save();
        res.send('created');
    }
})


const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}...`));