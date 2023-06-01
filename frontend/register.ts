document.addEventListener("DOMContentLoaded", async function () {
  let port: any
  if(window.location.port === "5500"){port= ":"+80;}
  
  const submitBtn: any = document.getElementById("submit");
  const username: any = document.getElementById("username");
  const password: any = document.getElementById("password");
  const passwordconfirm: any = document.getElementById("password-confirm");
  const totp: any = document.getElementById("code");

  const error_message: any = document.getElementById("error-message");

  const response: any = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/footer", {
    method: "GET",
  });
  const data = await response.json();

  let footer: any = document.getElementById("footer");
  footer.innerHTML = data.footer;

  submitBtn.disabled = true;

  const pattern = /^[0-9]+$/;
  let pass_valid = 0;
  let code_valid = 0;

  function CheckPatternAndPassword() {
    if (pattern.test(totp.value)) {
      code_valid = 1;
    } else {
      code_valid = 0;
    }
    if (
      password.value != passwordconfirm.value ||
      password.value.length == 0
    ) {
      pass_valid = 0;
    } else {
      pass_valid = 1;
    }
    if (pass_valid === 1 && code_valid === 1) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  password.addEventListener("input", CheckPatternAndPassword);
  totp.addEventListener("input", CheckPatternAndPassword);
  passwordconfirm.addEventListener("input", CheckPatternAndPassword);

  submitBtn.addEventListener("click", async (event: any) => {
    event.preventDefault();
    
    try {
      const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/user/register", {
        method: "POST",
        body: JSON.stringify({"username":username.value, "password": password.value, "code": totp.value}),
      });

      const data = await response.json();
      if (response.status != 201) {
        error_message.innerHTML = data.message || data.error;
        return;
      }
      localStorage.setItem("token", data.token);
      window.location.href = "./homepage.html";
    } catch (error: any) {
      console.error(`Registration failed: ${error.message}`);
    }
  });
});
