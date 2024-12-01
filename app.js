const express = require('express');
const mongoose = require('mongoose');
const { Result ,PlaceMent,Course, Attendence} = require('./schema');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const csvtojson = require('csvtojson');
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path to your CSV file
const filePath = path.join(__dirname, 'data/courses.csv');

dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb+srv://college:1234@cluster0.hz78q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(express.static('public'));
app.use(cors( {origin: 'http://localhost:3000', credentials: true}));
app.get('/', (req, res) => {
    res.send('Hello World');
});
const uploadCsvDataToMongoDB = async () => {
    try {
        const jsonArray = await csvtojson().fromFile(filePath);

        // Insert the array of student data into MongoDB
        console.log(jsonArray);
        await Course.insertMany(jsonArray);
        console.log('CSV data successfully uploaded to MongoDB');
    } catch (err) {
        console.error('Error uploading CSV data:', err);
    }
};
const verifyToken = (req,res,next)=>{

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
app.get('/results' ,verifyToken,async (req, res) => {
  
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
app.post('/attend', async (req, res) => {
    const {ROLL,CourseCode,status}= req.body;
    let TotalClasses = 0;
    let ClassesAttended = 0;

    if(ROLL=='' || CourseCode=='' || status==''){
        res.send('Please enter all fields');
    }else{
       //check if the student is already present
         const student = await Attendence.findOne({ROLL:ROLL,CourseCode:CourseCode});
            if(student){
                //only update the attendence if the student is already present
                if(status=='present'){
                   TotalClasses = student.TotalClasses + 1;
                    ClassesAttended = student.ClassesAttended + 1;
                    //update the attendence
                    const result = await Attendence.updateOne({ROLL:ROLL,CourseCode:CourseCode},{TotalClasses:TotalClasses,ClassesAttended:ClassesAttended});
                    res.send('Attendence updated successfully');
          
                }else{
                    //just update the total classes
                    TotalClasses = student.TotalClasses + 1;
                    const result = await Attendence.updateOne({ROLL:ROLL,CourseCode:CourseCode},{TotalClasses:TotalClasses});
                    res.send('Attendence updated successfully');
                }
            }else{
                //first time attendence
                if(status=='present'){
                    TotalClasses = 1;
                    ClassesAttended = 1;
                    const attendence = new Attendence({
                        ROLL:ROLL,
                        CourseCode:CourseCode,
                        TotalClasses:TotalClasses,
                        ClassesAttended:ClassesAttended
                    });
                    await attendence.save();
                    res.send('Attendence updated successfully');

                
            }else{
                TotalClasses = 1;
                const attendence = new Attendence({
                    ROLL:ROLL,
                    CourseCode:CourseCode,
                    TotalClasses:TotalClasses,
                    ClassesAttended:ClassesAttended
                });
                await attendence.save();
                res.send('Attendence updated successfully');
            }


    }
}
});
app.get('/attendence', async (req, res) => {
        const {ROLL,CourseCode}= req.body;
        const results = await Attendence.find({ROLL:ROLL,CourseCode:CourseCode});
        res.send(results);
    });
app.post('/login', async (req,res)=>{
    const {email,password}= req.body;
    console.log(req.body);
    if(email=='' || password==''){
        res.send('Please enter all fields');
    }else{
       
        if(email=='biswa@1' && password =='123'){
              
        const user = {email:email};
        const accessToken = jsonwebtoken.sign(user,process.env.JSON_KEY);
        res.cookie('token',accessToken,{httpOnly:true});
        res.redirect(process.env.CLIENT_ROUTE);
        }else{
            res.send('Email or password is incorrect');
        }   
}
})


const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}...`));