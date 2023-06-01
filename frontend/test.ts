let port: any
document.addEventListener("DOMContentLoaded", async function () {
  if(window.location.port === "5500"){port = ":"+80;}

  const createQuestionForm: any = document.getElementById(
    "create-question-form"
  );
  createQuestionForm.reset();


  const response: any = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/footer", {
    method: "GET",
  });
  const data = await response.json();

  let footer: any = document.getElementById("footer");
  footer.innerHTML = data.footer;
  // Add an event listener to each radial input element

  if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
  }

  const testId = window.location.hash.slice(1);
  if (!testId) {
    window.location.href = "./homepage.html";
  }
  const token = localStorage.getItem("token");

  try {
    let response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/test/fetch", {
      method: "POST",
      body: JSON.stringify({"token":localStorage.getItem("token"), "testId":testId}),
    });

    if (response.status != 200) {
      window.location.href = "./homepage.html";
    }

    
    let data = await response.json();
    let buttonPrepare: any = document.getElementById("prepare-test");
    let buttonAnswers: any = document.getElementById("show-answers");
    let buttonStartServer: any = document.getElementById("start-server");
    let buttonStartTest: any = document.getElementById("start-test");
    let buttonStopServer: any = document.getElementById("stop-server");
    let divServerStatus: any = document.getElementById("server-status")
    
    buttonAnswers.addEventListener("click", async function () {
      window.location.href = `./answers.html#${testId}`
    })

    if (data.test.state != "stale") {
      buttonPrepare.setAttribute("disabled", true);
    }
    if (data.test.state != "prepared") {
      buttonStartServer.setAttribute("disabled", true);
    }
    if (data.test.state != "waiting") {
    
      
      buttonStartTest.setAttribute("disabled", true);
    }
    if (data.test.state != "started") {
      
      buttonStopServer.setAttribute("disabled", true);
    }
    
    
    if (data.test.state === "stale") {
      divServerStatus.innerHTML = "Test is stale, click to 'prepare test' to prepare the test";
    }
    if (data.test.state === "prepared") {
      divServerStatus.innerHTML = "Test is prepared, to start click 'start server'";
    }
    if (data.test.state === "waiting") {
      divServerStatus.innerHTML =
        "Server is started, let your students join the game, then click 'start test' to start the test - Connect to "+ window.location.hostname+":"+data.test.port;
    }
    if (data.test.state === "started") {
      divServerStatus.innerHTML =
        "Test is running, when you finish, click 'stop server'";
    }


    buttonPrepare.addEventListener("click", async function () {
      
      buttonPrepare.style.backgroundColor = "#fffb00"; // Set the background color to green
      buttonPrepare.style.color = "black"; // Set the text color to white
      buttonPrepare.innerHTML = "Preparing...";
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "50%";
      modal.style.left = "50%";
      modal.style.transform = "translate(-50%, -50%)";
      modal.style.border = "1px solid black";
      modal.style.padding = "20px";
      modal.style.background="white";

      const title = document.createElement("h1");
      title.innerText = "Select gamemode and map";
      title.style.textAlign = "center";

      const gameSelect = document.createElement("select");
      gameSelect.id="gameSelect"
      const gameOptions = ["Search"];
      gameOptions.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.innerText = option;
        gameSelect.appendChild(opt);
      });

      const mapSelect = document.createElement("select");
      mapSelect.id="mapSelect"
      //! "Castello", "Museo" is unsupported
      // ["Serra", "Castello", "Museo"]
      const mapOptions = ["Serra"];
      mapOptions.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.innerText = option;
        mapSelect.appendChild(opt);
      });

      const button = document.createElement("button");
      button.innerText = "Confirm";
      button.addEventListener("click", async () => {
        try {
          modal.style.display = "none"
          buttonPrepare.setAttribute("disabled", true);
          const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/server/prepare", {
            method: "POST",
            //@ts-ignore
            body: JSON.stringify({"token":token, "testId":testId, "map":document.getElementById("mapSelect").value}),
          });
  
          if (response.status === 200) {
            buttonPrepare.removeAttribute("style")
            buttonPrepare.style.backgroundColor = "#9fff96";
            buttonPrepare.innerHTML = "Prepared Succesfully...";
            buttonStartServer.removeAttribute("disabled");
            divServerStatus.innerHTML = "Test is prepared, to start click 'start server'";
          } else {
            buttonPrepare.setAttribute("disabled", true);
            buttonPrepare.style.backgroundColor = "#ff8f8f";
            buttonPrepare.innerHTML = "Failed";
            if(response.status === 409){
              divServerStatus.innerHTML =
            "Troppe Domande per questa mappa, riduci il numero di domande o cambia mappa per continuare";
            setTimeout(() => {location.reload()}, 10000); 
          }else{
            setTimeout(() => {location.reload()}, 1000);
          }
          }
        } catch (error) {
          console.log(error);
          buttonPrepare.style.backgroundColor = "#ff8f8f"; buttonPrepare.innerHTML = "Timed Out"
          setTimeout(() => {buttonPrepare.style.backgroundColor = "#ff8f8f"; buttonPrepare.innerHTML = "Waiting for server fo finish..."}, 600);
          setTimeout(() => {buttonPrepare.style.backgroundColor = "#ff8f8f"; buttonPrepare.innerHTML = "Reloading"}, 4000);
          setTimeout(() => {location.reload()}, 5000);
        }
      });

      modal.appendChild(title);
      modal.appendChild(gameSelect);
      modal.appendChild(mapSelect);
      modal.appendChild(button);

      document.body.appendChild(modal);

    });

    buttonStartServer.addEventListener("click", async function () {
      buttonStartServer.style.backgroundColor = "#fffb00"; // Set the background color to green
      buttonStartServer.style.color = "black"; // Set the text color to white
      buttonStartServer.innerHTML = "Starting..."
      buttonStartServer.setAttribute("disabled", true);

      const response = await fetch(`http://`+window.location.hostname+port+`/api/server/start`, {
        method: "POST",
        body: JSON.stringify({"token":token, "testId":testId}),
      });

      data = await response.json();

      if (response.status === 200) {
        buttonStartServer.removeAttribute("style");
        buttonStartServer.innerHTML = "Started"
        buttonStartServer.style.backgroundColor= "#9fff96"
        buttonStartTest.removeAttribute("disabled");
        buttonStartServer.setAttribute("disabled", true);
        divServerStatus.innerHTML =
        "Server is started, let your students join the game, then click 'start test' to start the test - Connect to "+ window.location.hostname+":"+data.port;
      } else {
        buttonStartServer.style.backgroundColor = "#ff8f8f";
        buttonStartServer.innerHTML = "Failed"
      }
    });


    buttonStartTest.addEventListener("click", async function () {
      buttonStartTest.style.backgroundColor = "#fffb00"; // Set the background color to green
      buttonStartTest.style.color = "black"; // Set the text color to white
      buttonStartTest.innerHTML = "Authorizing..."


      buttonStartTest.setAttribute("disabled", true);

      const response = await fetch(`http://`+window.location.hostname+port+`/api/test/start`, {
        method: "POST",
        body: JSON.stringify({"token":token, "testId":testId}),
      });

      if (response.status === 200) {
        buttonStartTest.removeAttribute("style");
        buttonStartTest.setAttribute("disabled", true);
        buttonStartTest.style.backgroundColor= "#9fff96"
        buttonStartTest.innerHTML = "Press the lever in the lobby"
        buttonStopServer.removeAttribute("disabled")
        divServerStatus.innerHTML =
        "Test is running, when you finish, click 'stop server'";
      } else {
        buttonStartTest.style.backgroundColor = "#ff8f8f";
        buttonStartTest.innerHTML = "Failed"
      }
    });

    buttonStopServer.addEventListener("click", async function () {
      buttonStopServer.style.backgroundColor = "#fffb00"; // Set the background color to green
      buttonStopServer.style.color = "black"; // Set the text color to white
      buttonStopServer.innerHTML = "Stopping..."

      const formData: any = new FormData();
      formData.append("testId", testId);
      formData.append("token", token);

      buttonStopServer.setAttribute("disabled", true);

      const response = await fetch(`http://`+window.location.hostname+port+`/api/server/stop?testId=${testId}`, {
        method: "POST",
        body: JSON.stringify({"testId":testId, "token": token}),
      });

      if (response.status === 200) {
        buttonStopServer.removeAttribute("style");
        buttonStopServer.style.backgroundColor= "#9fff96"
        buttonStopServer.innerHTML = "Stopped"
        divServerStatus.innerHTML =
        "Stopped the server";
        setTimeout(() => location.reload(), 1000);
      } else {
        buttonStopServer.style.backgroundColor = "#ff8f8f";
        buttonStopServer.innerHTML = "Failed"
      }
    });

    response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/question/fetch", {
      method: "POST",
      body: JSON.stringify({"token":localStorage.getItem("token"), "testId": testId}),
    });

    if (response.status != 200) {
      window.location.href = "./homepage.html";
    }
    data = await response.json();

    const testDetailsDiv: any = document.getElementById("test-details");
    data.question.forEach((question: any) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("question");

      const questionDelete = document.createElement("button");
      questionDelete.name = question.id;
      questionDelete.innerHTML = "🗑";
      questionDiv.appendChild(questionDelete);

      const moveUp = document.createElement("button");
      moveUp.name = question.id;
      moveUp.id = "moveUp";
      moveUp.innerHTML = "↑";
      questionDiv.appendChild(moveUp);

      const moveDown = document.createElement("button");
      moveDown.name = question.id;
      moveDown.id = "moveDown";
      moveDown.innerHTML = "↓";
      questionDiv.appendChild(moveDown);

      moveUp.addEventListener("click", async function () {
        const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/question/changeorder", {
          method: "PUT",
          body: JSON.stringify({"token":token, "move":"-1", "questionId":questionDelete.name}),
        });

        if (response.status === 200) {
          window.location.reload();
        }
      });

      moveDown.addEventListener("click", async function () {
        const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/question/changeorder", {
          method: "PUT",
          body: JSON.stringify({"token":token, "move":"1", "questionId":questionDelete.name}),
        });

        if (response.status === 200) {
          window.location.reload();
        }
      });

      questionDelete.addEventListener("click", async function () {

        const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/question/delete", {
          method: "POST",
          body: JSON.stringify({"token":token, "questionId": questionDelete.name}),
        });

        if (response.status === 200) {
          window.location.reload();
        }
      });

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
        trueRadio.value = "1";
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
        falseRadio.value = "0";
        if (question.correctAnswer === 0) {
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
        if (question.choice3) {
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
        if (question.choice5) {
          const choice5Label = document.createElement("label");
          const choice5Radio = document.createElement("input");
          choice5Radio.type = "radio";
          choice5Radio.name = question.id;
          choice5Radio.value = "5";
          if (question.correctAnswer === 5) {
            choice5Radio.checked = true;
          }
          choice5Label.appendChild(choice5Radio);
          choice5Label.appendChild(document.createTextNode(question.choice5));
          questionDiv.appendChild(choice5Label);
        }
      }

      testDetailsDiv.appendChild(questionDiv);
    });

    const radioButtons: any = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(
      (button: {
        addEventListener: (arg0: string, arg1: () => void) => void;
        value: any;
        name: any;
      }) => {
        button.addEventListener("click", async () => {
          const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/question/edit", {
            method: "PUT",
            body: JSON.stringify({"questionId":button.name, "token":token, "correctAnswer":button.value}),
          });

          const data = await response.json();
        });
      }
    );
  } catch (error) {
    console.log(error);
  }

  const questionTextInput: any = document.getElementById("question-text-input");
  const correctAnswerInputTf: any = document.getElementById(
    "correct-answer-input-tf"
  );
  const correctAnswerInputMc: any = document.getElementById(
    "correct-answer-input-mc"
  );
  const choice1Input: any = document.getElementById("choice1-input");
  const choice2Input: any = document.getElementById("choice2-input");

  createQuestionForm.addEventListener("change", () => {
    let isValid = true;

    // Check if question text has a value
    if (questionTextInput.value === "") {
      isValid = false;
    }

    // Check if question type has a value
    if (questionTypeSelect.value === "") {
      isValid = false;
    } else if (questionTypeSelect.value === "true-false") {
      // Check if true/false question has a valid answer
      if (correctAnswerInputTf.value === "") {
        isValid = false;
      }
    } else if (questionTypeSelect.value === "multi") {
      // Check if multiple choice question has a valid answer and at least two choices
      if (correctAnswerInputMc.value === "") {
        isValid = false;
      }
      if (choice1Input.value === "" || choice2Input.value === "") {
        isValid = false;
      }
    }

    // Enable/disable submit button based on validity
    const submitButton = createQuestionForm.querySelector(
      "button[type='submit']"
    );
    submitButton.disabled = !isValid;
  });
});

// Get the elements
const questionTypeSelect: any = document.getElementById("question-type-select");
const trueFalseAnswers: any = document.getElementById("true-false-answers");
const multiChoiceAnswers: any = document.getElementById("multi-choice-answers");

// Add an event listener to the question type select element
questionTypeSelect.addEventListener("change", function () {
  // Check the value of the select element
  if (questionTypeSelect.value === "text") {
    // If it's "text", hide the true/false and multi-choice answer fields
    trueFalseAnswers.classList.add("hidden");
    multiChoiceAnswers.classList.add("hidden");
  } else if (questionTypeSelect.value === "true-false") {
    // If it's "true-false", show the true/false answer field and hide the multi-choice answer field
    trueFalseAnswers.classList.remove("hidden");
    multiChoiceAnswers.classList.add("hidden");
  } else if (questionTypeSelect.value === "multi") {
    // If it's "multi", show the multi-choice answer field and hide the true/false answer field
    trueFalseAnswers.classList.add("hidden");
    multiChoiceAnswers.classList.remove("hidden");
  }
});

const createQuestionForm: any = document.getElementById("create-question-form");

let jsonData: any = {}

createQuestionForm.addEventListener("submit", async (event: any) => {
  event.preventDefault();

  // Get the test ID and token from the page URL and local storage
  const testId: any = window.location.hash.slice(1);
  const token: any = localStorage.getItem("token");

  // Get the question data from the form
  //@ts-ignore
  const questionText: any = document.getElementById("question-text-input").value;
  //@ts-ignore
  const questionType: any = document.getElementById("question-type-select").value;
  //@ts-ignore
  const choice1 = document.getElementById("choice1-input").value;
  //@ts-ignore
  const choice2 = document.getElementById("choice2-input").value;
  //@ts-ignore
  const choice3 = document.getElementById("choice3-input").value;
  //@ts-ignore
  const choice4 = document.getElementById("choice4-input").value;
  //@ts-ignore
  const choice5 = document.getElementById("choice5-input").value;

  // Create a FormData object with the question data, test ID, and token
  jsonData.testId = testId;
  jsonData.token = token;
  jsonData.question = questionText;
  
  if (questionType === "text") {
    jsonData.type = "text";
  } else if (questionType === "multi") {
    //@ts-ignore
    const correctAnswer: any = document.getElementById("correct-answer-input-mc").value;
    jsonData.type="multi"
    jsonData.choice1 =  choice1
    jsonData.choice2 =  choice2
    if (choice3) jsonData.choice3 = choice3;
    if (choice4) jsonData.choice4 = choice4
    if (choice5) jsonData.choice5 = choice5
    jsonData.correctAnswer =  correctAnswer
  } else if (questionType === "true-false") {
    //@ts-ignore
    const correctAnswer: any = document.getElementById("correct-answer-input-tf").value;
    jsonData.type =  "true-false"
    jsonData.correctAnswer = correctAnswer
  }
  
  // Send a POST request to create the question
 
  const response = await fetch(window.location.protocol+"//"+window.location.hostname+port+"/api/question/create", {
    method: "POST",
    body: JSON.stringify(jsonData),
  });
  
  if (response.ok) {
    // Question successfully created, redirect to the test page
    window.location.reload();
  } else {
    throw new Error("Failed to create question.");
  }
});
