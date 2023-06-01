import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";
import crypto from "crypto"

const app = express();
const PORT = 80;

app.use(cors());

import user_register from "./routes/user/register";
import user_login from "./routes/user/login";
import user_logout from "./routes/user/logout";

import question_create from "./routes/questions/create";
import question_edit from "./routes/questions/update";
import question_delete from "./routes/questions/delete";
import question_fetch from "./routes/questions/fetch";
import question_change_order from "./routes/questions/orderChange"

import test_create from "./routes/test/create";
import test_delete from "./routes/test/delete";
import test_fetch from "./routes/test/fetch";
import test_prepare from "./routes/server/prepare";

import server_allowstart from "./routes/server/AllowStartTest"
import server_start from "./routes/server/start"
import server_stop from "./routes/server/stop"

import server_answer from "./routes/server/answer"

import footer from "./functions/getFooterText"


app.use(
  "/api/user/register",
  rateLimit({
    windowMs: 60000, // 200ms
    max: 50, // limit each IP to 1 requests per windowMs
    message: "Too many requests, please try again later.",
  }),
  user_register
);

app.use("/api/test/create", rateLimit({
    windowMs: 60000, // 200ms
    max: 5, // limit each IP to 1 requests per windowMs
    message: "Too many requests, please try again later.",
  }), test_create);

app.use("/api/server/stop", rateLimit({
    windowMs: 30000, // 
    max: 1, // limit each IP to 1 requests per windowMs
    message: "Too many requests, please try again later.",
  }), server_stop);

app.use("/api/test/start",  rateLimit({
  windowMs: 1000, // 200ms
  max: 10, // limit each IP to 1 requests per windowMs
  message: "Too many requests, please try again later.",
}), server_allowstart);

app.use("/api/server/start",  rateLimit({
  windowMs: 30000, // 200ms
  max: 1, // limit each IP to 1 requests per windowMs
  message: "Too many requests, please try again later.",
}), server_start);
app.use("/api/server/prepare",  rateLimit({
  windowMs: 12000,
  max: 1, // limit each IP to 1 requests per windowMs
  message: "Too many requests, please try again later.",
}), test_prepare);

app.use("/api/question/delete", question_delete);
app.use("/api/answer", server_answer);
app.use("/api/test/fetch", test_fetch);
app.use("/api/user/logout", user_logout);
app.use("/api/question/create", question_create);
app.use("/api/question/fetch", question_fetch);
app.use("/api/question/edit", rateLimit({
  windowMs: 7000, // 200ms
  max: 10,
}),question_edit);
app.use("/api/test/delete", test_delete);
app.use("/api/question/changeorder", question_change_order);
app.use("/api/footer", footer)

app.use(
  "/api/user/login",
  rateLimit({
    windowMs: 120000, // 200ms
    max: 5, // limit each IP to 1 requests per windowMs
    message: {"message": "5 Incorrect login attempts, try again in 2 minutes..."},
  }),
  user_login
);

app.listen(PORT, () => console.log("Server running on port 5000"));
