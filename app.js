const express = require('express');
const mongoose = require('mongoose');
const { Result ,PlaceMent} = require('./schema');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
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

app.get('/', (req, res) => {
    res.send('Hello World');
});
const uploadCsvDataToMongoDB = async () => {
    try {
        const jsonArray = await csvtojson().fromFile(filePath);

        // Insert the array of student data into MongoDB
        console.log(jsonArray);
        await PlaceMent.insertMany(jsonArray);
        console.log('CSV data successfully uploaded to MongoDB');
    } catch (err) {
        console.error('Error uploading CSV data:', err);
    }
};

// Call the function to upload data
app.get('/upload-csv-data', async (req, res) => {
    await uploadCsvDataToMongoDB();
    res.send('Data uploaded successfully');
});
app.get('/results', async (req, res) => {
    const results = await Result.find();
    res.send(results);
});
app.get('/2023-placement', async (req, res) => {
    const results = await PlaceMent.find();
    res.send(results);
});
//login
app.post('/login', async (req,res)=>{
    const {email,password}= req.body;
    console.log(req.body);
    if(email=='' || password==''){
        res.send('Please enter all fields');
    }else{
       
        if(email=='dassudipto200@gmail.com' && password =='1234'){
              
        const user = {email:email};
        const accessToken = jsonwebtoken.sign(user,process.env.JSON_KEY);
        res.cookie('token',accessToken,{httpOnly:true});
        res.redirect('http://localhost:3000');
        }else{
            res.send('Email or password is incorrect');
        }   
}
})


const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}...`));