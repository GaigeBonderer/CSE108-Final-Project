// gameRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');


// GAME ROUTES

// Route to handle GET requests to the game page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'game.html'));
});

router.get('/:userId/:classId', (req, res) => {
    if (req.session && req.session.userId === req.params.userId) {
        // User is logged in and matches the session user ID
        res.sendFile(path.join(__dirname, '..', 'views', 'game.html'));
    } else {
        // User is not authorized
        res.status(403).send('Unauthorized access');
    }
});



module.exports = router;