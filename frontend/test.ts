document.addEventListener("DOMContentLoaded", async function () {
  if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
  }

  const testId = window.location.hash.slice(1);
  if(!testId){
    window.location.href = "./homepage.html"
  }
  const token = localStorage.getItem("token");

  try {
    // Create a FormData object with the test ID and token
    const formData: any = new FormData();
    formData.append("testId", testId);
    formData.append("token", token);

    const response = await fetch("http://127.0.0.1:5000/api/test/fetch", {
      method: "POST",
      body: formData,
    });

    if(response.status != 200){
      window.location.href = "./homepage.html"
    }
    const data = await response.json();

    const testDetailsDiv: any = document.getElementById("test-details");
    console.log(data);
    const testDetails = `
	<h1>${data.test.name}</h1>
	<p>Owner: ${data.test.owner}</p>
	<p>State: ${data.test.state}</p>
`;
    testDetailsDiv.innerHTML = testDetails;

    // Display the questions in a table
    const questionList: any = document.getElementById("question-list");
    const questions = data.questions;
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionRow = `
		<tr>
			<td>${question.order}</td>
			<td>${question.type}</td>
		</tr>
	`;
      questionList.innerHTML += questionRow;
    }
  } catch (error: any) {
    console.error(`Fetch failed: ${error.message}`);
  }
});
