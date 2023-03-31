document.addEventListener("DOMContentLoaded", async function () {
  if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
  }

  const logoutButton: any = document.getElementById("logout");

  logoutButton.addEventListener("click", async function () {
    const formData: any = new FormData();
    formData.append("token", localStorage.getItem("token"));

    const response = await fetch("http://localhost:5000/api/user/logout", {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      window.location.href = "./login.html";
      localStorage.removeItem("token")
    }
  });

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
  
    const data: any = await response.json();
  
    if (response.status !== 200) {
      error_message.innerHTML = data.message || data.error;
      return;
    }
    
    if(!data.data.length){
      const table: any = document.getElementById("table");
      table.remove()
    }
  
    const table: any = document.getElementById("table");
    const tbody: any = document.getElementById("table-data");
    
    data.data.forEach((item: any) => {
      const tr = document.createElement("tr");
    
      const nameTd = document.createElement("td");
      const nameLink = document.createElement("a");
      nameLink.href = `http://127.0.0.1:3000/frontend/test.html#${item.id}`;
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
        if(deleteButton.innerHTML === "Delete"){
          deleteButton.innerHTML = "Click again to delete";
          deleteButton.style.borderColor = "red"
          return;
        }
        const formData: any = new FormData();
        formData.append("testId", deleteButton.name);
        formData.append("token", localStorage.getItem("token"));
    
        const response = await fetch("http://localhost:5000/api/test/delete", {
          method: "POST",
          body: formData,
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
  

  newTestButton.addEventListener("click", async (event: any) => {
    event.preventDefault();
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
