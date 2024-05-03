// gameRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');


// Add body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// GAME ROUTES

// Base Route
// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'game.html'));
// });

// Route for accessing the game with specific user and class parameters
router.get('/:userId/:classId', (req, res) => {
    const sessionUserId = parseInt(req.session.userId, 10);
    const requestedUserId = parseInt(req.params.userId, 10);

    console.log("Session User ID: ", sessionUserId, "Requested User ID: ", requestedUserId);

    if (sessionUserId === requestedUserId) {
        res.sendFile(path.join(__dirname, '..', 'views', 'game.html'));
    } else {
        res.status(403).send('Unauthorized access');
    }
});



module.exports = router;