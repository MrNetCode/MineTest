document.addEventListener("DOMContentLoaded", async function () {
  let port: any
  if(window.location.port === "5500"){port= ":"+80;}
  
  if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
  }
  
  let response: any = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/footer", {
    method: "GET",
  });
  let data = await response.json();

  let footer: any = document.getElementById("footer");
  footer.innerHTML = data.footer;

  response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/answer", {
    method: "POST",
    body: JSON.stringify({"token":localStorage.getItem("token"), "testId": window.location.hash.slice(1) })
  });

    data = await response.json();
    const table: any = document.getElementById("table");
  if (response.ok && data.answers.length!==0) {
      // Loop through the answers in the data and add them to the table
      data.answers.forEach((answer: { player: any; question_text: any; player_answer: any; correct_answer: any; is_correct: boolean; }) => {
        const row = table.insertRow();
        row.insertCell(0).innerHTML = answer.player;
        row.insertCell(1).innerHTML = answer.question_text;
        row.insertCell(2).innerHTML = answer.player_answer;
        const correctCell = row.insertCell(3);
        correctCell.innerHTML = answer.is_correct;
        if (answer.is_correct) {
          row.classList.add("correct");
        } else {
          row.classList.add("incorrect");
        }
      });
      
      
  
  }else{
    table.style.display="none";
    const error_message: any = document.getElementById("error_message");
    error_message.style.display=""
  }
})