// Get the test ID and token from the URL and localStorage respectively
const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testid');
const token = localStorage.getItem('token');
function main() {
  
// Create a FormData object with the test ID and token
const formData: any = new FormData();
formData.append('testid', testId);
formData.append('token', token);

// Send a POST request to the API endpoint with the FormData
fetch('http://127.0.0.1:5000/api/test/fetch', {
	method: 'POST',
	body: formData
})
.then(response => response.json())
.then(data => {
  //!FIXME NOT WORKING
	// Display the test details at the top of the page
	const testDetailsDiv: any = document.getElementById('test-details');
	const testDetails = `
		<h1>${data.test.name}</h1>
		<p>Owner: ${data.test.owner}</p>
		<p>State: ${data.test.state}</p>
	`;
	testDetailsDiv.innerHTML = testDetails;

	// Display the questions in a table
	const questionList: any = document.getElementById('question-list');
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
})
.catch(error => console.log(error));
}

main()