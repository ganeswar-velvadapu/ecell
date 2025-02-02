require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, 
    }
});

pool.connect().then(res => console.log("Connected to Neon PostgreSQL"))
    .catch(err => console.log("Error connecting to the database", err));

module.exports = pool;
