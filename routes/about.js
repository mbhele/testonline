// In your routes/chatbot.js file

const express = require('express');
const router = express.Router();

// Example route for handling GET requests to /chatbot
router.get('/', (req, res) => {
  res.render('about')
});

module.exports = router;
