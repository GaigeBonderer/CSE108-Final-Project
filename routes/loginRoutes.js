// loginRoute.js
const express = require('express');
const router = express.Router();
const path = require('path');


// LOGIN ROUTES


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/', (req, res) => {
    // Here, handle your login logic and authentication
    res.redirect('/class');
});

module.exports = router;
