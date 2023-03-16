import {generateTOTP} from "../functions/generateTOTP"
import dotenv from "dotenv"
dotenv.config()

describe("User API Test", () => {
  test("Register with invalid totp code", async () => {
    const formData: any = new FormData();
    formData.append("username", process.env.TEST_USERNAME);
    formData.append("password", process.env.TEST_PASSWORD);
    formData.append("code", "00000000");

    const response = await fetch("http://localhost:5000/api/user", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.message).toEqual("Invalid TOTP code");
  });

  test("Register with missing username, code or password", async () => {
    const formData: any = new FormData();
    formData.append("username", "");
    formData.append("password", process.env.TEST_PASSWORD);
    formData.append("code", "123456");

    const response = await fetch("http://localhost:5000/api/user", {
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

    const response = await fetch("http://localhost:5000/api/user", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.error).toEqual("Illegal Username");
  });
});
