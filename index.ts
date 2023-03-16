import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

// import user-register from "./routes/";
// import user-login from "./routes/";
// import user-logout from "./routes/";
// import question-create from "./routes/";
// import question-edit from "./routes/";
// import question-delete from "./routes/";
// import question-fetch from "./routes/";
// import test-create from "./routes/";
// import test-delete from "./routes/";
// import test-fetch from "./routes/";
// import test-deploy from "./routes/";


// app.get("/api/question", question-fetch);


app.listen(PORT, () => console.log("Server running on http://localhost:5000"));
