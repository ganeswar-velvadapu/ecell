# E-Commerce Platform

This is a full-stack e-commerce application built with  Express, React, Node.js and PostgreSQL as the database. It features a complete user authentication system, product management, and order processing workflow.

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
    Navigate to the `backend` directory and install the required npm packages.
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    Navigate to the `frontend` directory and install the required npm packages.
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up Environment Variables:**
    In the `backend` directory, create a `.env` file and add the following variables. Replace the placeholder values with your actual configuration.
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
    From the `backend` directory:
    ```bash
    npm start
    ```
    The backend server should now be running on `http://localhost:5000`.

7.  **Run the Frontend Application:**
    From the `frontend` directory:
    ```bash
    npm start
    ```
    The React development server will start, and you can view the application in your browser, usually at `http://localhost:3000`.

---

## Backend API Routes

Here is a list of the available API endpoints:

### Auth Routes

* `POST /api/auth/signup`: Register a new user.
* `POST /api/auth/login`: Log in a user and get a JWT.
* `GET /api/auth/logout`: Log Out current user.
* `GET /api/auth/me`: Get the currently logged-in user's data.

### Product Routes

* `GET /api/products`: Get a list of all products.
* `GET /api/products/:id`: Get a single product by its ID.
* `POST /api/products`: Create a new product (Admin only).
* `PUT /api/products/:id`: Update a product by its ID (Admin only).
* `DELETE /api/products/:id`: Delete a product by its ID (Admin only).


### Order Routes

* `POST /api/products/:id/buy`: Create a new order.
* `GET /api/products/orders/cancel/:orderId`: Cancel an existing order.
* `GET /products/orders/requests`: Check all order requests (Admin Only).
