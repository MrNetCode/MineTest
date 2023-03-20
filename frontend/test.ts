const testId = window.location.hash.substr(1);

async function fetchTest(testId: any) {
    try {
        let form: any = new FormData();
        form.append("token", localStorage.getItem("token"));
        form.append("testId", testId);
    
        const response = await fetch("http://127.0.0.1:5000/api/test/fetch", {
          method: "POST",
          //? Add this header in this request to skip the TOTP code check and get a fake token
          // headers: {"test": "test"},
          body: form,
        });
    
        const data = await response.json();
        if(response.status != 200){
          console.log(data.error || data.message)
          return;
        }
        // TODO: make it parse the question array from server
      } catch (error: any) {
        console.error(`Registration failed: ${error.message}`);
      }
}

fetchTest(testId)