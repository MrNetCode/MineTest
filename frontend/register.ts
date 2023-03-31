document.addEventListener("DOMContentLoaded", async function () {
  const submitBtn: any = document.getElementById("submit");
  const username: any = document.getElementById("username");
  const password: any = document.getElementById("password");
  const passwordconfirm: any = document.getElementById("password-confirm");
  const totp: any = document.getElementById("code");

  const error_message: any = document.getElementById("error-message");

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
      let form = new FormData();
      form.append("username", username.value);
      form.append("password", password.value);
      form.append("code", totp.value);

      const response = await fetch("http://127.0.0.1:5000/api/user/register", {
        method: "POST",
        //? Add this header in this request to skip the TOTP code check and get a fake token
        // headers: {"test": "test"},
        body: form,
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
