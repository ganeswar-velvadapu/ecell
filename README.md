# E-Cell E-Commerce Platform

This is a full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) and using PostgreSQL as the database. It features a complete user authentication system, product management, and order processing workflow.

---

## Features

* **User Authentication**: Secure user registration and login system using JSON Web Tokens (JWTs).
* **Role-Based Access Control**: Separate routes and permissions for regular users and administrators.
* **Product Management (Admin)**: Administrators can create, read, update, and delete products from the database.
* **Shopping Cart**: Users can add products to their cart, view the cart, and adjust quantities.
* **Order Processing**: Users can place orders for the items in their cart.
* **Order Management (Admin)**: Administrators can view and manage all user orders.
* **Customer Loyalty Program**: A simple reward points system for customers.
* **Responsive UI**: A clean and user-friendly interface built with React.

---

## Tech Stack

* **Frontend**: React, React Router
* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL
* **Authentication**: JSON Web Tokens (JWT)

---

## Project Setup

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ecell/ecell-E-Commerce-App.git](https://github.com/ecell/ecell-E-Commerce-App.git)
    cd ecell-E-Commerce-App
    ```

2.  **Install Backend Dependencies:**
    Navigate to the `server` directory and install the required npm packages.
    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    Navigate to the `client` directory and install the required npm packages.
    ```bash
    cd ../client
    npm install
    ```

4.  **Set up Environment Variables:**
    In the `server` directory, create a `.env` file and add the following variables. Replace the placeholder values with your actual configuration.
    ```
    PORT=5000
    DB_USER=your_postgres_user
    DB_HOST=localhost
    DB_DATABASE=your_database_name
    DB_PASSWORD=your_postgres_password
    DB_PORT=5432
    JWT_SECRET=your_jwt_secret
    ```

5.  **Set up the Database:**
    Make sure you have PostgreSQL installed and running. Create a new database with the name you specified in the `.env` file. You can then run any necessary database migration or seed files (if provided) to set up the tables.

6.  **Run the Backend Server:**
    From the `server` directory:
    ```bash
    npm start
    ```
    The backend server should now be running on `http://localhost:5000`.

7.  **Run the Frontend Application:**
    From the `client` directory:
    ```bash
    npm start
    ```
    The React development server will start, and you can view the application in your browser, usually at `http://localhost:3000`.

---

## Backend API Routes

Here is a list of the available API endpoints:

### Auth Routes

* `POST /api/auth/register`: Register a new user.
* `POST /api/auth/login`: Log in a user and get a JWT.
* `GET /api/auth/user`: Get the currently logged-in user's data.

### Product Routes

* `GET /api/products`: Get a list of all products.
* `GET /api/products/:id`: Get a single product by its ID.
* `POST /api/products`: Create a new product (Admin only).
* `PUT /api/products/:id`: Update a product by its ID (Admin only).
* `DELETE /api/products/:id`: Delete a product by its ID (Admin only).

### Cart Routes

* `GET /api/cart`: Get the current user's shopping cart.
* `POST /api/cart`: Add a product to the cart.
* `PUT /api/cart/:productId`: Update the quantity of a product in the cart.
* `DELETE /api/cart/:productId`: Remove a product from the cart.

### Order Routes

* `POST /api/orders`: Create a new order from the user's cart.
* `GET /api/orders`: Get a list of the current user's orders.
* `GET /api/orders/all`: Get a list of all orders (Admin only).
* `GET /api/orders/:id`: Get a single order by its ID.
* `PUT /api/orders/:id/status`: Update the status of an order (Admin only).
