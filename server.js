//server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const pool = require('./db/db'); 
const session = require('express-session');

// Require Paths to Imported Routes
const classRoutes = require('./routes/classRoutes');
const gameRoutes = require('./routes/gameRoutes');
const loginRoutes = require('./routes/loginRoutes');
const signupRoutes = require('./routes/signupRoutes');

const app = express();

app.use(session({
    secret: 'CSE108-FinalProject',  // secret key for express session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if want HTTPS (needs code changes)
}));

// Import routes from respective ___Route.js files
app.use('/class', classRoutes);
app.use('/game', gameRoutes);
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);

// Add body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Redirect root to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
