import mysql from 'mysql2/promise';
export const connection = mysql.createConnection({
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASS}`,
    database: `${process.env.DB_DEFAULT_SCHEMA}`,
  });