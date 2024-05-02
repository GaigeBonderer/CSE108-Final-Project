# CSE108-Final-Project
Final Project for CSE108

How to run:
1. Check node_modules folder
2 (if empty) type "npm install" in terminal
3. type "npm start" in terminal
4. no virtual enviroment needed since dependencies are not stored on device
5. if issues arise check that you have sqlite

File stucutre guide (Not up to date will update soon - Gaige 05/02/24):

public: This directory seems to contain all the files that will be served to clients. It includes:

    static: Static files such as CSS and JavaScript files.

        css: CSS files for styling.
            classStyle.css: Css formatting for class selection page
            gameStyle.css: Css formatting for game page
            loginStyle.css: Css formatting for login page

        js: JavaScript files for client-side logic.
            classJS.js: JavaScript for class selection page
            gameJS.js: JavaScript for class selection page
            loginJS.js: JavaScript for class selection page

views: .html files
    class.html: Main html for class selection page
    game.html: Main html for game page
    login.html: Main html for login page

server: This directory appears to contain the server-side code of your application. It includes:
    models: This directory may contain database models or other data-related logic.
    routes: This directory likely contains route handlers for your server.
    server.js: This file is the entry point for your Node.js server.

README.md: This file typically contains information about your project.
Requirements.txt: This file might list the dependencies required for your project
