# CSE108-Final-Project
Final Project for CSE108

How to run:
1. Check node_modules folder
2 (if empty) type "npm install" in terminal
3. type "npm run build-game" in the terminal to initialize the game engine -- *Start here is dependencies are present*
4. type "npm start" in terminal 
5. no virtual enviroment needed since dependencies are not stored on device
6. if issues arise check that you have sqlite

Recomendations:
- Download DB Browser SQLite to be able to veiw what is stored in the database: https://sqlitebrowser.org/dl/
- For a test user use: username: Slayer, Password: temp123, userID: 1




File stucutre guide (in Root Folder "CSE108-FINAL-PROJECT"):

db:

    -db.js: initializes SQLite database on connects to SQLite database

models:

    -User.js: Defines user table and functions to interact with user table

node_modules: Stores dependencies, dependencies can be up dated by "npm install *the dependency name*" or "npm install" which updates 
                all dependencies from packages.json

public: This directory contains all the front-end files

    -css: CSS files for styling.

        --classStyle.css: Css formatting for class selection page
        --gameStyle.css: Css formatting for game page
        --loginStyle.css: Css formatting for login page
        --signupStyle.css: Css formatting for signup page

    -js: JavaScript files for client-side logic.

        --game:
            ---index.js: holds all scripts for game logic

            ---dist: directory used by phase (dont touch)

            ---resources: store recourses for the game sucha as sprites and sounds
                ----Knight.png: the greatest sprite art known to man kind, represent the player charater

            ---scenes: Stores scenes for rendering maps and entitiy actions (player Movement)
                ----MainScene.js: Has main information about player and map

        --classJS.js: JavaScript for class selection page
        --gameJS.js: JavaScript for game page
        --loginJS.js: JavaScript for login page
        --signupJS.js: JavaScript for signup page

    -images: Stores images for web application

        --LoginBackground.jpg: Background image for login/signup/class page

views: .html files

    -class.ejs: Main html for class selection page (Uses ejs)
    -game.ejs: Main html for game page (Uses ejs)
    -login.html: Main html for login page
    -signup.html: Main html for signup page

routes: Stores routes for various pages that are imported into server.js

    -classRoutes.js: Stores routes for /class page
    -gameRoutes.js: Stores routes for /game page
    -loginRoutes.js: Stores routes for /login page
    -signupRoutes.js: Stores routes for /signup page

server.js: Initializes the node.js sever, establishes the base route, and imports page specific routes from routes folder

package.json: Stores dependencies (modules) that are needed for the project

Slayerz.sqlite: SQLite database file that stores database tables and their elements
