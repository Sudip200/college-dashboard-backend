const express = require('express');
const mongoose = require('mongoose');
const { Result ,PlaceMent} = require('./schema');
const cors = require('cors');
const app = express();
app.use(cors());
const csvtojson = require('csvtojson');
const path = require('path');

// Path to your CSV file
const filePath = path.join(__dirname, 'data/2023.csv');

// Function to read CSV and upload data to MongoDB


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

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));