// Import the mysql2/promise library
import mysql from "mysql2/promise";

// Create a MySQL database connection using environment variables for configuration
export const connection = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1", // The host name of the database server
  user: process.env.DB_USER || "root", // The database user's username
  password: process.env.DB_PASS || "password", // The database user's password
  database: process.env.DB_DEFAULT_SCHEMA || "test", // The name of the default schema/database
});
