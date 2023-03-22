import { generateTOTP } from "../functions/generateTOTP";
import { connection } from "../functions/DB_Connection"
import dotenv from "dotenv";
dotenv.config();

let token: any
let testId: any

beforeAll(async () => {
await (await connection).query("DELETE FROM users WHERE username='Test'")
})

test("User Register success", async () => {
    const formData: any = new FormData();
    formData.append("username", "Test");
    formData.append("password", "password");
    formData.append("code", generateTOTP())

    const response = await fetch("http://localhost:5000/api/user/register", {
      method: "POST",
      body: formData,
    });
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
    token = data.token
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
    testId = data.testId
    expect(response.status).toBe(201);
  });

  test("Question Create success", async () => {
    const formData: any = new FormData();
    formData.append("token", token);
    formData.append("type", "true-false");
    formData.append("question", "This is a question(true-false)")
    formData.append("testId", testId)
    formData.append("correctAnswer", "1")

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
    formData.append("question", "This is a question(true-false)")
    formData.append("testId", testId)
    formData.append("correctAnswer", "1")

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
    formData.append("question", "This is a question(true-false)")
    formData.append("testId", testId)
    formData.append("correctAnswer", "1")

    const response = await fetch("http://localhost:5000/api/question/create", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(201);
  });