document.addEventListener("DOMContentLoaded", async function () {
  
  let port: any
  if(window.location.port === "5500"){port= ":"+80;}
    
  const submitBtn: any = document.getElementById("submit-btn");
  const username: any = document.getElementById("username");
  const password: any = document.getElementById("password");

  submitBtn.disabled = true;
  let disabledBy429 = false;

  const response: any = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/footer", {
    method: "GET",
  });
  const data = await response.json();

  let footer: any = document.getElementById("footer");
  footer.innerHTML = data.footer;
  
  async function inputNotNull() {
    const username: any = document.getElementById("username");
    const password: any = document.getElementById("password");
    if (
      username.value.length != 0 &&
      password.value.length != 0 &&
      !disabledBy429
    ) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }
  submitBtn.addEventListener("click", async (event: any) => {
    const error_message: any = document.getElementById("error-message");
    event.preventDefault();
    submitBtn.innerHTML = "Loading...";
    submitBtn.disabled = true;
    const username: any = document.getElementById("username");
    const password: any = document.getElementById("password");

    const response: any = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/user/login", {
      method: "POST",
      body: JSON.stringify({"username":username.value, "password": password.value}),
    });
    const data = await response.json();
    if (!response.ok) {
      error_message.innerHTML = data.message || data.error;
      submitBtn.innerHTML = "Login";
      submitBtn.disabled = false;
      if (response.status === 429) {
        disabledBy429 = true;
        submitBtn.disabled = true;
        const registerLink: any = document.getElementById("register-link")
        registerLink.href = "#"
        registerLink.style="color: gray;"
        setTimeout(() => {
          submitBtn.disabled = false;
          disabledBy429 = false;
          registerLink.style=""
          registerLink.href = "./register.html"
        }, 120000);
      }
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "./homepage.html";
  });
  username.addEventListener("input", inputNotNull);
  password.addEventListener("input", inputNotNull);
});
