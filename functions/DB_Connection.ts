// Import the mysql2/promise library
import mysql from 'mysql2/promise';

// Create a MySQL database connection using environment variables for configuration
export const connection = mysql.createConnection({
    host: `${process.env.DB_HOST}`, // The host name of the database server
    user: `${process.env.DB_USER}`, // The database user's username
    password: `${process.env.DB_PASS}`, // The database user's password
    database: `${process.env.DB_DEFAULT_SCHEMA}`, // The name of the default schema/database
});
