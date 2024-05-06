//server.js
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path'); 
const pool = require('./db/db'); 
const session = require('express-session');
const socketIo = require('socket.io');

// Require Paths to Imported Routes
const classRoutes = require('./routes/classRoutes');
const gameRoutes = require('./routes/gameRoutes');
const loginRoutes = require('./routes/loginRoutes');
const signupRoutes = require('./routes/signupRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const players = {};

app.use(session({
    secret: 'CSE108-FinalProject',  // secret key for express session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if you're using HTTPS
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
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Add new player to the players object
    players[socket.id] = {
        playerId: socket.id,
        x: 100,
        y: 100,
    };

    socket.on('spawn', () => {
        socket.emit('init', socket.id);
    })

    // Broadcast new player to other clients
    socket.broadcast.emit('playerConnected', players[socket.id]);

    // Send existing players to the new player
    Object.keys(players).forEach(playerId => {
        if (playerId !== socket.id) {
            socket.emit('playerConnected', players[playerId]);
        }
    });

    // Listen for player movements
    socket.on('playerMovement', (movement) => {
        if (players[socket.id]) {
            players[socket.id].x = movement.x;
            players[socket.id].y = movement.y;
    
            // Broadcast player movements to other clients
            socket.broadcast.emit('playerMoved', { playerId: socket.id, x: movement.x, y: movement.y });
        }
    });

    socket.on('playerDied', (data) => {
        const killedPlayerId = data.playerId;
        console.log(killedPlayerId);
        // Broadcast player death to all clients
        socket.broadcast.emit('playerDied', { playerId: killedPlayerId });
        delete players[killedPlayerId];
    });


    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Broadcast player disconnection to other clients
        socket.broadcast.emit('playerDisconnected', { playerId: socket.id });

        // Remove player from players object
        delete players[socket.id];
    });
});

// Server setup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});