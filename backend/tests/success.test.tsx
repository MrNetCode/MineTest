import { generateTOTP } from "../functions/generateTOTP";
import mysql from "mysql2";
import dotenv from "dotenv";

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1", // The host name of the database server
  user: process.env.DB_USER || "root", // The database user's username
  password: process.env.DB_PASS || "password", // The database user's password
  database: process.env.DB_DEFAULT_SCHEMA || "test", // The name of the default schema/database
});

connection.query("DELETE FROM users WHERE username='Test'");
connection.end();

dotenv.config();

let token: any;
let testId: any;

test("User Register success", async () => {
  const formData: any = new FormData();
  formData.append("username", "Test");
  formData.append("password", "password");
  formData.append("code", generateTOTP());

  const response = await fetch("http://localhost:5000/api/user/register", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  expect(response.status).toBe(201);
});

test("User Login success", async () => {
  const formData: any = new FormData();
  formData.append("username", "Test");
  formData.append("password", "password");

  const response = await fetch("http://localhost:5000/api/user/login", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  token = data.token;
  expect(response.status).toBe(201);
});

test("Test Create success", async () => {
  const formData: any = new FormData();
  formData.append("token", token);
  formData.append("name", "Test1");

  const response = await fetch("http://localhost:5000/api/test/create", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  testId = data.testId;
  expect(response.status).toBe(201);
});

test("Question Create success", async () => {
  const formData: any = new FormData();
  formData.append("token", token);
  formData.append("type", "true-false");
  formData.append("question", "This is a question(true-false)");
  formData.append("testId", testId);
  formData.append("correctAnswer", "1");

  const response = await fetch("http://localhost:5000/api/question/create", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  expect(response.status).toBe(201);
});

test("Question Create text", async () => {
  const formData: any = new FormData();
  formData.append("token", token);
  formData.append("type", "text");
  formData.append("question", "This is a question(true-false)");
  formData.append("testId", testId);
  formData.append("correctAnswer", "1");

  const response = await fetch("http://localhost:5000/api/question/create", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  expect(response.status).toBe(201);
});

test("Question Create true-false", async () => {
  const formData: any = new FormData();
  formData.append("token", token);
  formData.append("type", "true-false");
  formData.append("question", "This is a question(true-false)");
  formData.append("testId", testId);
  formData.append("correctAnswer", "1");

  const response = await fetch("http://localhost:5000/api/question/create", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  expect(response.status).toBe(201);
});
