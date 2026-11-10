// Imports -------------------------
import mysql from 'mysql2/promise';

// Database configuration ----------
const dbConfig = {
    database: 'roasterybakery',
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: '',
    namedPlaceholders: true,
};

// Database Connection Pool ---------
// A pool, so a transaction can take its own connection (getConnection) without
// other requests' queries running inside it. pool.query works like connection.query.

let database = null;

try{
    database = mysql.createPool(dbConfig);
    // createPool connects lazily, so test one connection now to fail fast at startup
    const connection = await database.getConnection();
    connection.release();
} catch (error) {
    console.log(`Error in establishing database connection: ${error.message}`);
    process.exit();
}

export default database;