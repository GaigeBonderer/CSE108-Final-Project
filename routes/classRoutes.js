// classRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');

// CLASS ROUTES

// Route to handle GET requests to the class page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'class.html'));
});




module.exports = router;