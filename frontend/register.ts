const submitButton: any = document.getElementById("submit");

const username: any = document.getElementById("username")
const passwordbox: any = document.getElementById("password");
const passwordconfirmbox: any = document.getElementById("password-confirm");
const code_box: any = document.getElementById("code");

const error_message: any = document.getElementById("error-message")

submitButton.disabled = true;

const pattern = /^[0-9]+$/;
let pass_valid = 0;
let code_valid = 0;

function CheckPatternAndPassword() {
  if (
    pattern.test(code_box.value)
  ) {
    code_valid = 1;
  } else {
    code_valid = 0;
  }
  if (
    passwordbox.value != passwordconfirmbox.value || passwordbox.value.length == 0
  ) {
    pass_valid = 0;
  } else {
    pass_valid = 1;
  }
  if (pass_valid === 1 && code_valid === 1) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

passwordbox.addEventListener("input", CheckPatternAndPassword);
code_box.addEventListener("input", CheckPatternAndPassword);
passwordconfirmbox.addEventListener("input", CheckPatternAndPassword);

submitButton.addEventListener("click", async (event: any) => {
  event.preventDefault();
  try {
    let form = new FormData();
    form.append("username", username.value);
    form.append("password", passwordbox.value);
    form.append("code", code_box.value);

    const response = await fetch("http://127.0.0.1:5000/api/user/register", {
      method: "POST",
      //? Add this header in this request to skip the TOTP code check and get a fake token
      // headers: {"test": "test"},
      body: form,
    });

    const data = await response.json();
    if(response.status != 201){
      error_message.innerHTML = data.message || data.error
      return
    }
    console.log(data.token)
    localStorage.setItem("token", data.token)
    window.location.href = "./homepage.html"
  } catch (error: any) {
    console.error(`Registration failed: ${error.message}`);
  }
});
