import {generateTOTP} from "../functions/generateTOTP"
import dotenv from "dotenv"
dotenv.config()

describe("Register API Test", () => {
  test("Register with invalid totp code", async () => {
    const formData: any = new FormData();
    formData.append("username", process.env.TEST_USERNAME);
    formData.append("password", process.env.TEST_PASSWORD);
    formData.append("code", "00000000");

    const response = await fetch("http://localhost:5000/api/user/register", {
      method: "POST",
      body: formData,
    })
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.message).toEqual("Invalid TOTP code");
  });

  test("Register with missing username, code or password", async () => {
    const formData: any = new FormData();
    formData.append("username", "");
    formData.append("password", process.env.TEST_PASSWORD);
    formData.append("code", "123456");

    const response = await fetch("http://localhost:5000/api/user/register", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.message).toEqual("missing username, code or password");
  });

  test("Register with illegal username", async () => {
    const formData: any = new FormData();
    formData.append("username", "adm--in");
    formData.append("password", process.env.TEST_PASSWORD);
    formData.append("code", generateTOTP());

    const response = await fetch("http://localhost:5000/api/user/register", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.error).toEqual("Illegal Username");
  });
});


describe("Login API Test", () => {
  test("Missing Username or Password", async () => {
    const formData = new FormData();
    formData.append("password", "test123");

    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.message).toEqual("missing username or password");
  });

  test("Illegal Username", async () => {
    const formData = new FormData();
    formData.append("username", "12345--");
    formData.append("password", "test123");

    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.error).toEqual("Illegal Username");
  });

  test("Invalid Username or Password", async () => {
    const formData = new FormData();
    formData.append("username", "Testuser");
    formData.append("password", "wrongpassword");

    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.message).toEqual("Invalid Username or password");
  });

  test("Successful Login", async () => {
    const formData: any = new FormData();
    formData.append("username", process.env.TEST_USERNAME);
    formData.append("password", process.env.TEST_PASSWORD)

    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.token).toBeDefined();
  });
});

