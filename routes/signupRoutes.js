// signupRoutes.js
const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db/db');
const router = express.Router();
const { createUser } = require('../models/User');
const bodyParser = require('body-parser');

// Add body-parser middleware
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
        console.log('New user created with ID:', userId); // Optional: log the newly created user ID
        res.redirect('/class');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error registering new user');
    }
});

module.exports = router;
// router.post('/', async (req, res) => {
//     try {
//         // console.log(req.body); // Log the request body
//         const { username, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert new user into the database
//         const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
//         db.run(sql, [username, hashedPassword], function(err) {
//             if (err) {
//                 console.error('Signup error:', err);
//                 res.status(500).send('Error registering new user');
//             } else {
//                 res.redirect('/class');
//             }
//         });
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(500).send('Error registering new user');
//     }
// });

module.exports = router;