document.addEventListener("DOMContentLoaded", async function () {
  const createQuestionForm: any = document.getElementById("create-question-form")
createQuestionForm.reset();


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
    console.log(data);

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
      }

      testDetailsDiv.appendChild(questionDiv);
    });
  } catch (error) {
    console.log(error);
  }

  const questionTextInput:any = document.getElementById("question-text-input");
  const correctAnswerInputTf:any = document.getElementById("correct-answer-input-tf");
  const correctAnswerInputMc = document.getElementById("correct-answer-input-mc");
  const choice1Input = document.getElementById("choice1-input");
  const choice2Input = document.getElementById("choice2-input");
  
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
    const submitButton = createQuestionForm.querySelector("button[type='submit']");
    console.log(isValid)
    submitButton.disabled = !isValid;
  });
});


// Get the elements
const questionTypeSelect: any = document.getElementById('question-type-select');
const trueFalseAnswers: any = document.getElementById('true-false-answers');
const multiChoiceAnswers: any = document.getElementById('multi-choice-answers');

// Add an event listener to the question type select element
questionTypeSelect.addEventListener('change', function() {
  // Check the value of the select element
  if (questionTypeSelect.value === 'text') {
    // If it's "text", hide the true/false and multi-choice answer fields
    trueFalseAnswers.classList.add('hidden');
    multiChoiceAnswers.classList.add('hidden');
  } else if (questionTypeSelect.value === 'true-false') {
    // If it's "true-false", show the true/false answer field and hide the multi-choice answer field
    trueFalseAnswers.classList.remove('hidden');
    multiChoiceAnswers.classList.add('hidden');
  } else if (questionTypeSelect.value === 'multi') {
    // If it's "multi", show the multi-choice answer field and hide the true/false answer field
    trueFalseAnswers.classList.add('hidden');
    multiChoiceAnswers.classList.remove('hidden');
  }


});


const createQuestionForm: any = document.getElementById("create-question-form");

createQuestionForm.addEventListener("submit", async (event: any) => {
  event.preventDefault();

  // Get the test ID and token from the page URL and local storage
  const testId:any = window.location.hash.slice(1);
  const token:any = localStorage.getItem("token");

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
  const formData: any = new FormData();
  formData.append("testId", testId);
  formData.append("token", token);
  formData.append("question", questionText);

  if (questionType === "text") {
    formData.append("type", "text");
  } else if (questionType === "multi") {
    //@ts-ignore
    const correctAnswer: any = document.getElementById("correct-answer-input-mc").value;
    formData.append("type", "multi");
    formData.append("choice1", choice1);
    formData.append("choice2", choice2);
    if (choice3) formData.append("choice3", choice3);
    if (choice4) formData.append("choice4", choice4);
    if (choice5) formData.append("choice5", choice5);
    formData.append("correctAnswer", correctAnswer);
  } else if (questionType === "true-false") {
    //@ts-ignore
    const correctAnswer: any = document.getElementById("correct-answer-input-tf").value;
    formData.append("type", "true-false");
    formData.append("correctAnswer", correctAnswer);
  }

  // Send a POST request to create the question
  const response = await fetch("http://127.0.0.1:5000/api/question/create", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    // Question successfully created, redirect to the test page
    window.location.reload()
  } else {
    throw new Error("Failed to create question.");
  }
});
