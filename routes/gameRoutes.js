// gameRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');


// GAME ROUTES

// Route to handle GET requests to the game page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'game.html'));
});



module.exports = router;