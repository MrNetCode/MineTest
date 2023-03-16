const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

describe('Database Connection', () => {
  it('Should connect to the database successfully', (done) => {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DEFAULT_SCHEMA
    });

    connection.connect((err: any) => {
      if (err) {
        console.error('Database connection error:', err);
        done.fail();
      } else {
        connection.end();
        done();
      }
    });
  });
});
