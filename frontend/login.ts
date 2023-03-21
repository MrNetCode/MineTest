const form = document.querySelector('.form-container');
const submitBtn: any = document.getElementById('submit-btn');

submitBtn.disabled = true

submitBtn.addEventListener('click', async (event: any) => {
  const error_message: any = document.getElementById("error-message")
  event.preventDefault();
submitBtn.innerHTML = "Loading..."
submitBtn.disabled = true
  const username: any = document.getElementById('username');
  const password: any = document.getElementById('password');

  const form = new FormData()
  form.append("username", username.value)
  form.append("password", password.value)
  const response:any = await fetch('http://localhost:5000/api/user/login', {
    method: 'POST',
    body: form
  });
  const data = await response.json();
  if(!response.ok){
      error_message.innerHTML = data.message || data.error
      submitBtn.innerHTML = "Login"
      submitBtn.disabled = false
return;
}

localStorage.setItem("token", data.token)
window.location.href = "./homepage.html"

  console.log(data.token);
  
})
