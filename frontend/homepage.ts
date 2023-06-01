document.addEventListener("DOMContentLoaded", async function () {
  let port: any
  if(window.location.port === "5500"){port= ":"+80;}

  const newTestbutton: any = document.getElementById("newTest");
  const newTestTextbox: any = document.getElementById("newTestTextbox");
  newTestTextbox.addEventListener("input", function () {
    if (newTestTextbox.value.length != 0) {  newTestbutton.disabled = false; return}
    newTestbutton.disabled = true
  });

  const response: any = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/footer", {
    method: "GET",
  });
  const data = await response.json();

  let footer: any = document.getElementById("footer");
  footer.innerHTML = data.footer;

  const logoutButton: any = document.getElementById("logout");

  logoutButton.addEventListener("click", async function () {

    const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/user/logout", {
      method: "POST",
      body: JSON.stringify({"token": localStorage.getItem("token")})
    });

    if (response.status === 200) {
      localStorage.removeItem("token");
      window.location.href = "./login.html";
    }
  });

  const table: any = document.getElementById("table-data");
  const error_message: any = document.getElementById("error-message");

  try {

    const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/test/fetch", {
      method: "POST",
      body: JSON.stringify({"token":localStorage.getItem("token"), "fetchAll": "true"}),
    });

    if (response.status == 401) {
      window.location.href = "./login.html";
    }
    const data: any = await response.json();

    if (response.status !== 200) {
      error_message.innerHTML = data.message || data.error;
      return;
    }

    if (!data.data.length) {
      const table: any = document.getElementById("table");
      table.style.display="none";
    }

    const table: any = document.getElementById("table");
    const tbody: any = document.getElementById("table-data");

    data.data.forEach((item: any) => {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      const nameLink = document.createElement("a");
      nameLink.href = `./test.html#${item.id}`;
      nameLink.textContent = item.name;
      nameTd.appendChild(nameLink);
      tr.appendChild(nameTd);

      const stateTd = document.createElement("td");
      stateTd.textContent = item.state;
      tr.appendChild(stateTd);

      const deleteTd = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.type = "submit";
      deleteButton.id = "delete";
      deleteButton.name = item.id;
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", async function () {
        if (deleteButton.innerHTML === "Delete") {
          deleteButton.innerHTML = "Click again to delete";
          deleteButton.style.borderColor = "red";
          return;
        }
        const formData: any = new FormData();
        formData.append("testId", deleteButton.name);
        formData.append("token", localStorage.getItem("token"));

        const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/test/delete", {
          method: "POST",
          body: JSON.stringify({"testId":deleteButton.name, "token":localStorage.getItem("token")}),
        });

        if (response.status === 200) {
          window.location.reload();
        }
      });

      const removeTd = document.createElement("td");
      removeTd.appendChild(deleteButton);
      tr.appendChild(removeTd);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
  } catch (error: any) {
    console.error(`Fetch failed: ${error.message}`);
  }

  newTestbutton.addEventListener("click", async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/test/create", {
        method: "POST",
        body: JSON.stringify({"token":localStorage.getItem("token"),"name":newTestTextbox.value}),
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
