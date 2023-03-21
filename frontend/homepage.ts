if(!localStorage.getItem("token")){
	window.location.href= "./login.html"
}
const table: any = document.getElementById('table-data')
const formData: any = new FormData();
formData.append('fetchAll', 'true');

formData.append('token', localStorage.getItem('token'));

fetch('http://127.0.0.1:5000/api/test/fetch', {
	method: 'POST',
	body: formData
})
.then(response => response.json())
.then(data => {
	let tableData = '';
	data.data.forEach((item: { id: any; name: any; state: any; }) => {
		tableData += `<tr>
			<td><a href="http://127.0.0.1:3000/frontend/test.html#${item.id}">${item.name}</a></td>
			<td>${item.state}</td>
		</tr>`;
	});
	table.innerHTML = tableData;
});