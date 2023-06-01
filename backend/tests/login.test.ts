describe("Login API", () => {
  //! Invalid Login Attempts

  test("Login With username but no password", async () => {
    const response = await await fetch("http://localhost/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username: "MrNetCode" }),
    });

    const data = await response.json();
    expect(data.message).toMatch("Missing username or password");
    expect(response.status).toEqual(401);
  });

  test("Login With password but no username", async () => {
    const response = await await fetch("http://localhost/api/user/login", {
      method: "POST",
      body: JSON.stringify({ password: "pass" }),
    });

    const data = await response.json();
    expect(data.message).toMatch("Missing username or password");
    expect(response.status).toEqual(401);
  });

  test("Login no username and no password", async () => {
    const response = await await fetch("http://localhost/api/user/login", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const data = await response.json();
    expect(data.message).toMatch("Missing username or password");
    expect(response.status).toEqual(401);
  });

  test("Login invalid username", async () => {
    const response = await await fetch("http://localhost/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username: "/(&", password: "oass" }),
    });

    const data = await response.json();

    expect(data.error).toMatch("Username is not valid");
    expect(response.status).toEqual(401);

  });

  test("Login with valid username", async () => {
    const response = await await fetch("http://localhost/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username: "MrNetCode", password: "pass" }),
    });

    const data = await response.json();

    expect(data.token).toMatch(/^[a-f0-9]{100}$/);
    expect(response.status).toEqual(201);
  });

  test("Too many requests", async () => {
    const response = await await fetch("http://localhost/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username: "MrNetCode", password: "pass" }),
    });

    const data = await response.json();

    expect(response.status).toEqual(429);
  });
});
