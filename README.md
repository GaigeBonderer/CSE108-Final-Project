# CSE108-Final-Project
Final Project for CSE108

How to run:
1. Check node_modules folder
2 (if empty) type "npm install" in terminal
3. type "npm start" in terminal -- *Start here is dependencies are present*
4. no virtual enviroment needed since dependencies are not stored on device
5. if issues arise check that you have sqlite

Recomendations:
- Download DB Browser SQLite to be able to veiw what is stored in the database: https://sqlitebrowser.org/dl/

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

    -js: JavaScript files for client-side logic.

        --classJS.js: JavaScript for class selection page
        --gameJS.js: JavaScript for class selection page
        --loginJS.js: JavaScript for class selection page

    -images: Stores images for web application

        --LoginBackground.jpg: Background image for login/signup page

views: .html files

    -class.html: Main html for class selection page
    -game.html: Main html for game page
    -login.html: Main html for login page

routes: Stores routes for various pages that are imported into server.js

    -classRoutes.js: Stores routes for /class page
    -gameRoutes.js: Stores routes for /game page
    -loginRoutes.js: Stores routes for /login page
    -signupRoutes.js: Stores routes for /signup page

server.js: Initializes the node.js sever, establishes the base route, and imports page specific routes from routes folder

package.json: Stores dependencies (modules) that are needed for the project

Slayerz.sqlite: SQLite database file that stores database tables and their elements
