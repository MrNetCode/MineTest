import express from "express";
import cors from "cors";
import { generateTOTP } from "./functions/generateTOTP";

const app = express();
const PORT = 5000;

app.use(cors());

import user_register from "./routes/user/register";
import rateLimit from "express-rate-limit";
import user_login from "./routes/user/login";
import user_logout from "./routes/user/logout";
import question_create from "./routes/questions/create";
import question_edit from "./routes/questions/update";
import question_delete from "./routes/questions/delete";
import question_fetch from "./routes/questions/fetch";
import test_create from "./routes/test/create";
import test_delete from "./routes/test/delete";
import test_fetch from "./routes/test/fetch";
import change_order from "./routes/questions/orderChange"
import test_prepare from "./routes/test/prepare";

app.use(
  "/api/user/register",
  rateLimit({
    windowMs: 60000, // 200ms
    max: 5, // limit each IP to 1 requests per windowMs
    message: "Too many requests, please try again later.",
  }),
  user_register
);

app.use("/api/test/create", test_create);
app.use("/api/test/prepare", test_prepare);
app.use("/api/question/delete", question_delete);
app.use("/api/test/fetch", test_fetch);
app.use("/api/user/logout", user_logout);
app.use("/api/question/create", question_create);
app.use("/api/question/fetch", question_fetch);
app.use("/api/question/edit", question_edit);
app.use("/api/test/delete", test_delete);
app.use("/api/question/changeorder", change_order);

app.use(
  "/api/user/login",
  rateLimit({
    windowMs: 200, // 200ms
    max: 100, // limit each IP to 1 requests per windowMs
    message: "Too many requests, please try again later.",
  }),
  user_login
);

app.listen(PORT, () => console.log("Server running on http://localhost:5000"));
