// Imports -------------------------
import mysql from 'mysql2/promise';

// Database configuration ----------
const dbConfig = {
    database: '',
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: '',
    namedPlaceholders: true,
};

// Database Connection --------------

let database = null;

try{
    database = await mysql.createConnection(dbConfig);
} catch (error) {
    console.log(`Error in establishing database connection: ${error.message}`);
    process.exit();
}

export default database;