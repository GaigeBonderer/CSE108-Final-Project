// signupRoutes.js
const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db/db');
const router = express.Router();
const { createUser } = require('../models/User');
const bodyParser = require('body-parser');

// body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// SIGNUP ROUTES
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
});

// Handle signup form submission
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userId = await createUser(username, password);
        console.log('New user created with ID:', userId);
        req.session.userId = userId;  // Save new user ID in session
        res.redirect(`/class/${userId}`);  // Redirect to a personalized class page
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error registering new user');
    }
});

module.exports = router;