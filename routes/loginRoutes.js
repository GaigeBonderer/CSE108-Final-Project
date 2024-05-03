// loginRoute.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { findUserByUsername, comparePasswords } = require('../models/User');
const bodyParser = require('body-parser');

// Add body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// LOGIN ROUTES

//Basic Page Navigation
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});


// Login form submission
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log("Searching for username:", username);
        const user = await findUserByUsername(username);
        if (!user) {
            res.status(401).json({ message: 'No user found with that username.' });
            return;
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (passwordMatch) {
            req.session.userId = user.id;  // Save user ID in session
            res.json({ success: true, redirect: `/class/${user.id}` }); // Redirect to a personalized class page
        } else {
            res.status(401).json({ message: 'Incorrect password.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error processing login request.' });
    }
});

module.exports = router;
