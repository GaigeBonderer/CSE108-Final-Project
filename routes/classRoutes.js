// classRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { findUserById } = require('../models/User');

// CLASS ROUTES

//Fetch userID Routes
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await findUserById(req.params.userId);
        if (user) {
            res.json({ success: true, username: user.username });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to handle GET requests to the class page
router.get('/:userId', async (req, res) => {
    try {
        const user = await findUserById(req.params.userId);
        if (user) {
            res.render('class', { username: user.username });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;