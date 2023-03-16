import express from "express";
import cors from "cors";
import { generateTOTP } from "./functions/generateTOTP";

const app = express();
const PORT = 5000;

app.use(cors());


import user_register from "./routes/user/register";
import rateLimit from "express-rate-limit";
 import user_login from "./routes/user/login";
// import user-logout from "./routes/";
// import question-create from "./routes/";
// import question-edit from "./routes/";
// import question-delete from "./routes/";
// import question-fetch from "./routes/";
// import test-create from "./routes/";
// import test-delete from "./routes/";
// import test-fetch from "./routes/";
// import test-deploy from "./routes/";

app.use("/api/user/register", rateLimit({
    windowMs: 200, // 200ms
    max: 100, // limit each IP to 1 requests per windowMs
    message: "Too many requests, please try again later."
  }) , user_register);

app.use("/api/user/login", rateLimit({
    windowMs: 200, // 200ms
    max: 100, // limit each IP to 1 requests per windowMs
    message: "Too many requests, please try again later."
  }) , user_login);


app.listen(PORT, () => console.log("Server running on http://localhost:5000"));
