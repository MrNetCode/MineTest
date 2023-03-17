describe("Test Create API", () => {
  test("Missing parameters", async () => {
    const response = await fetch("http://localhost:5000/api/test/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.message).toEqual("Bad Request");
  });

  test("Invalid token", async () => {
    const formData: any = new FormData();
    formData.append("token", "invalid_token");
    formData.append("name", "Test");

    const response = await fetch("http://localhost:5000/api/test/create", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.message).toEqual("Invalid token");
  });
});

describe("Test Fetch API", () => {
  test("Invalid Token Fetch", async () => {
    const formData: any = new FormData();
    formData.append("token", "invalid_token");
    formData.append("testId", "id");

    const response = await fetch("http://localhost:5000/api/test/fetch", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.message).toEqual("Invalid token");
  });

  test("Invalid TestId fetch", async () => {
    const formData: any = new FormData();
    formData.append("token", process.env.TOKEN_TEST || "testtoken");
    formData.append("testId", "NotTestId");

    const response = await fetch("http://localhost:5000/api/test/fetch", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    expect(response.status).toBe(404);
    expect(data.message).toEqual("Test not found");
  });
});
