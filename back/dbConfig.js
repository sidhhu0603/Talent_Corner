require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100, 
    queueLimit: 0,
});

const poolPromise = pool.promise();

async function testConnection() {
    try {
        // Perform a simple query to test the connection
        await poolPromise.query('SELECT 1');
        console.log('Connected to database.');
    } catch (err) {
        console.error('Database connection failed:', err.stack);
    }
}

testConnection();

module.exports = poolPromise;









