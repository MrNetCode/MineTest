document.addEventListener("DOMContentLoaded", async function () {
  if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
  }
  const table: any = document.getElementById("table-data");
  const newTestButton: any = document.getElementById("newTest");
  const newTestTextbox: any = document.getElementById("newTestTextbox");
  const error_message: any = document.getElementById("error-message");

  try {
    const formData: any = new FormData();
    formData.append("fetchAll", "true");
    formData.append("token", localStorage.getItem("token"));

    const response = await fetch("http://127.0.0.1:5000/api/test/fetch", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.status != 200) {
      error_message.innerHTML = data.message || data.error;
      return;
    }
    let tableData = "";
    data.data.forEach((item: { id: any; name: any; state: any }) => {
      tableData += `<tr>
				<td><a href="http://127.0.0.1:3000/frontend/test.html#${item.id}">${item.name}</a></td>
				<td>${item.state}</td>
			</tr>`;
    });
    table.innerHTML = tableData;
  } catch (error: any) {
    console.error(`Fetch failed: ${error.message}`);
  }

  newTestButton.addEventListener("click", async (event: any) => {
    event.preventDefault();
    console.log(localStorage.getItem("token"));
    try {
      let form: any = new FormData();
      form.append("token", localStorage.getItem("token"));
      form.append("name", newTestTextbox.value);

      const response = await fetch("http://127.0.0.1:5000/api/test/create", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (response.status != 201) {
        error_message.innerHTML = data.message || data.error;
        return;
      }
      window.location.href = "./homepage.html";
    } catch (error: any) {
      console.error(`Registration failed: ${error.message}`);
    }
  });
});
