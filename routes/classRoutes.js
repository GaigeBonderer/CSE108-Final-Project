// classRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');

// CLASS ROUTES

// Route to handle GET requests to the class page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'class.html'));
});

router.get('/:userId', (req, res) => {
    if (req.session.userId && req.params.userId == req.session.userId.toString()) {
        res.sendFile(path.join(__dirname, '..', 'views', 'class.html'));
    } else {
        res.status(403).send("Unauthorized access");
    }
});




module.exports = router;