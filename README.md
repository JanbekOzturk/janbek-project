Project: Janbek’s After School Activities Management System
Author: Janbek




Necessary links;

Vue.js Github Repository; https://github.com/JanbekOzturk/janbek-project


GitHub Pages Link; https://janbekozturk.github.io/janbek-project/


Express.js GitHub Repository; https://github.com/JanbekOzturk/janbek-project/tree/main/server


Render API Link; https://janbek-project-api.onrender.com




1. Overview

This project is a full-stack web application I built to manage after-school activities.
It displays a list of lessons (stored in MongoDB), allows users to create orders, and updates lesson availability accordingly.
The system demonstrates my ability to set up a Node.js + Express backend, connect it to MongoDB, expose REST API routes, and use Vue.js on the front-end to handle rendering, user interaction, and dynamic updates.
My goal with this project was to understand how each layer of a real web application works and how data flows across the stack.

2. Technology Stack

Front-end:
-Vue.js (main app logic and components)
-HTML, CSS (my own original styling)

Back-end:
-Node.js
-Express.js
-REST API structure
-Middleware setup
-Render deployment

Database:
-MongoDB Atlas
-MongoDB Native Driver for schema modelling

3. Features
Lessons;
-Lessons are stored in MongoDB.
-Each lesson includes: title, category, location, price, available spaces, description, and image name.
-Lessons are fetched from the backend using GET /lessons.
-Vue displays the lessons in a clean grid layout.

Orders;
-Users can “book” a lesson.
-Front-end sends an order to the server via POST /orders.
-Order information is stored in the database.
-When an order is created, the lesson’s available space is updated automatically.

Updating Lessons;
The backend exposes a route PUT /lessons/:id which allows updating the space value of a lesson.
I tested this route using Postman to confirm that it correctly updates documents in MongoDB.

Deployment;
-> The API is deployed on Render and connects directly to MongoDB Atlas.
-> The front-end loads data from the deployed API using fetch().

4. How the Application Works
1. Front-End (Vue):
The Vue app fetches lessons from the API.
It renders them dynamically and reacts to user interactions.
When a user creates an order, Vue sends the order to the backend and refreshes the lesson list.

2. Back-End (Express):
Receives requests from the front-end.
Uses middleware for request handling (JSON parsing, CORS, logging on Render).
Sends lesson data as JSON.
Accepts order data and stores it in MongoDB.
Updates lesson spaces when orders are created.

3. MongoDB:
Stores lessons and orders permanently.
The back-end uses the MongoDB Native Node.js Driver to read, write, and update documents directly.
Every API call interacts with the database.