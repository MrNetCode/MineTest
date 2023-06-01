describe("Register API", () => {
    test("Register with username, password, no TOTP", async () => {
        const response = await fetch("http://localhost/api/user/register", {
          method: "POST",
          body: JSON.stringify({ "username": "MrNetCode", "password":"pass"}),
        });
    
        const data = await response.json();
        expect(data.message).toEqual("Missing parameter(s): code")
      });
      test("Register with username, TOTP", async () => {
        const response = await fetch("http://localhost/api/user/register", {
          method: "POST",
          body: JSON.stringify({ "username": "MrNetCode", "code":"000000"}),
        });
    
        const data = await response.json();
        expect(data.message).toEqual("Missing parameter(s): password")
      });
      test("Register with password, TOTP", async () => {
        const response = await fetch("http://localhost/api/user/register", {
          method: "POST",
          body: JSON.stringify({ "password": "pass", "code":"000000"}),
        });
    
        const data = await response.json();
        expect(data.message).toEqual("Missing parameter(s): username")
      });
})