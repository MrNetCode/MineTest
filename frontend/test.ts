document.addEventListener("DOMContentLoaded", async function () {
  if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
  }

  const testId = window.location.hash.slice(1);
  if (!testId) {
    window.location.href = "./homepage.html";
  }
  const token = localStorage.getItem("token");

  try {
    // Create a FormData object with the test ID and token
    const formData: any = new FormData();
    formData.append("testId", testId);
    formData.append("token", token);

    const response = await fetch("http://127.0.0.1:5000/api/question/fetch", {
      method: "POST",
      body: formData,
    });

    if (response.status != 200) {
      window.location.href = "./homepage.html";
    }
    const data = await response.json();
    console.log(data)

    const testDetailsDiv: any = document.getElementById("test-details");
    data.question.forEach((question: any) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("question");

      const questionText = document.createElement("p");
      questionText.innerText = question.text;
      questionDiv.appendChild(questionText);

      if (question.type === "text") {
        const answerInput = document.createElement("input");
        answerInput.type = "text";
        questionDiv.appendChild(answerInput);
      } else if (question.type === "true-false") {
        const trueLabel = document.createElement("label");
        const trueRadio = document.createElement("input");
        trueRadio.type = "radio";
        trueRadio.name = question.id;
        trueRadio.value = "true";
        if (question.correctAnswer === 1) {
          trueRadio.checked = true;
        }
        trueLabel.appendChild(trueRadio);
        trueLabel.appendChild(document.createTextNode("True"));
        questionDiv.appendChild(trueLabel);

        const falseLabel = document.createElement("label");
        const falseRadio = document.createElement("input");
        falseRadio.type = "radio";
        falseRadio.name = question.id;
        falseRadio.value = "false";
        if (question.correctAnswer === 1) {
          falseRadio.checked = true;
        }
        falseLabel.appendChild(falseRadio);
        falseLabel.appendChild(document.createTextNode("False"));
        questionDiv.appendChild(falseLabel);
      } else if (question.type === "multi") {
        const choice1Label = document.createElement("label");
        const choice1Radio = document.createElement("input");
        choice1Radio.type = "radio";
        choice1Radio.name = question.id;
        choice1Radio.value = "1";
        if (question.correctAnswer === 1) {
          choice1Radio.checked = true;
        }
        choice1Label.appendChild(choice1Radio);
        choice1Label.appendChild(document.createTextNode(question.choice1));
        questionDiv.appendChild(choice1Label);
      
        const choice2Label = document.createElement("label");
        const choice2Radio = document.createElement("input");
        choice2Radio.type = "radio";
        choice2Radio.name = question.id;
        choice2Radio.value = "2";
        if (question.correctAnswer === 2) {
          choice2Radio.checked = true;
        }
        choice2Label.appendChild(choice2Radio);
        choice2Label.appendChild(document.createTextNode(question.choice2));
        questionDiv.appendChild(choice2Label);
      if(question.choice3){
        const choice3Label = document.createElement("label");
        const choice3Radio = document.createElement("input");
        choice3Radio.type = "radio";
        choice3Radio.name = question.id;
        choice3Radio.value = "3";
        if (question.correctAnswer === 3) {
          choice3Radio.checked = true;
        }
      
        choice3Label.appendChild(choice3Radio);
        choice3Label.appendChild(document.createTextNode(question.choice3));
        questionDiv.appendChild(choice3Label);
      }
        if (question.choice4) {
          const choice4Label = document.createElement("label");
          const choice4Radio = document.createElement("input");
          choice4Radio.type = "radio";
          choice4Radio.name = question.id;
          choice4Radio.value = "4";
          if (question.correctAnswer === 4) {
            choice4Radio.checked = true;
          }
          choice4Label.appendChild(choice4Radio);
          choice4Label.appendChild(document.createTextNode(question.choice4));
          questionDiv.appendChild(choice4Label);
        }
      }      

      testDetailsDiv.appendChild(questionDiv);
    });
  } catch (error) {
    console.log(error);
  }
});
