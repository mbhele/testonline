// routes/fileUpload.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Route to render the upload form
router.get('/upload', (req, res) => {
    res.render('uploadQuestion'); // Assuming you have a view file named 'uploadQuestion'
});

// Route to handle the uploaded file
router.post('/upload', upload.single('questionsFile'), (req, res) => {
    // Assuming the uploaded file is a JSON file containing questions
    const questionsData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));

    // Do something with the questions data, like storing it in a database or processing it
    console.log(questionsData);

    // Redirect back to the upload page or render a success page
    res.redirect('/upload');
});

module.exports = router;
