import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";
import multer from "multer";

dotenv.config();
const router = express.Router();

console.log("Loaded Question Create Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

// initialize multer for file uploads
const upload = multer();

// handle POST requests to create new questions
router.post("/", upload.none(), async (request, response) => {
  try {
    if (!request.body) {
      return response.status(400).send({ message: "Bad Request" });
    }

    const {
      token,
      type,
      testId,
      question,
      choice1,
      choice2,
      choice3,
      choice4,
      choice5,
      correctAnswer,
    } = request.body;

    let missingParams = [];
    // check for missing parameters
    if (!token || !type || !testId || !question) {
      if (!token) missingParams.push("token");
      if (!type) missingParams.push("type");
      if (!testId) missingParams.push("testId");
      if (!question) missingParams.push("question");
      return response
        .status(401)
        .send({ message: `Missing parameter(s): ${missingParams.join(", ")}` });
    }

    if (correctAnswer.length != 1 || !/^[1-5]+$/.test(correctAnswer)) {
      return response
        .status(400)
        .send({ massage: "correctAnswer must be an integer" });
    }

    if (correctAnswer === "1" && !choice1) {
      return response
        .status(400)
        .send({ message: "correctAnswer must match an existing choice" });
    }

    if (correctAnswer === "2" && !choice2) {
      return response
        .status(400)
        .send({ message: "correctAnswer must match an existing choice" });
    }

    if (correctAnswer === "3" && !choice3) {
      return response
        .status(400)
        .send({ message: "correctAnswer must match an existing choice" });
    }

    if (correctAnswer === "4" && !choice4) {
      return response
        .status(400)
        .send({ message: "correctAnswer must match an existing choice" });
    }

    if (correctAnswer === "5" && !choice5) {
      return response
        .status(400)
        .send({ message: "correctAnswer must match an existing choice" });
    }

    // check the token against the database
    const result: any = await (
      await connection
    ).query("SELECT username FROM tokens WHERE token = ?", [token]);

    if (result[0].length === 0) {
      return response.status(401).send({ message: "Invalid token" });
    }

    const maxOrderNumberResult: any = await (
      await connection
    ).query(
      "SELECT MAX(`order`) AS max_order_number FROM questions WHERE `test` = ?",
      [testId]
    );
    let orderNumber = 1;

    if (maxOrderNumberResult[0].length > 0) {
      orderNumber = maxOrderNumberResult[0][0].max_order_number + 1;
    }
    // insert question into database
    const questionId = crypto.randomUUID();

    if (type != "multi" && type != "true-false" && type != "text") {
      return response.status(400).send({ message: "Invalid type" });
    }

    // insert multi-choice or true-false question into database, if applicable
    if (type === "multi" && choice1 && choice2 && correctAnswer) {
      await (
        await connection
      ).query(
        "INSERT INTO questions (id, `order`, test, type, text) VALUES (?, ?, ?, ?, ?)",
        [questionId, orderNumber, testId, type, question]
      );
      await (
        await connection
      ).query(
        "INSERT INTO multi_choice (id, choice1, choice2, choice3, choice4, choice5, correct) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [questionId, choice1, choice2, choice3, choice4, choice5, correctAnswer]
      );
    } else if (
      type === "true-false" &&
      (correctAnswer == 1 || correctAnswer == 0)
    ) {
      console.log("creating true-false question");
      await (
        await connection
      ).query(
        "INSERT INTO questions (id, `order`, test, type, text) VALUES (?, ?, ?, ?, ?)",
        [questionId, orderNumber, testId, type, question]
      );
      await (
        await connection
      ).query("INSERT INTO true_false (id, text, correct) VALUES (?, ?, ?)", [
        questionId,
        question,
        correctAnswer,
      ]);
      await (await connection).query(
        "INSERT INTO true_false (id, text, correctAnswer) VALUES (?, ?, ?)",
        [questionId, question, correctAnswer]
      );
    } else if (type === "text") {
      await (
        await connection
      ).query(
        "INSERT INTO questions (id, `order`, test, type, text) VALUES (?, ?, ?, ?, ?)",
        [questionId, orderNumber, testId, type, question]
      );
    } else {
      console.log("passing the if");
      if (type === "multi") {
        missingParams = [];
        if (!choice1) missingParams.push("choice1");
        if (!choice2) missingParams.push("choice2");
        if (!correctAnswer) missingParams.push("correctAnswer");
        return response
          .status(401)
          .send({
            message: `Missing parameter(s): ${missingParams.join(", ")}`,
          });
      } else if (type === "true-false") {
        missingParams = [];
        if (!correctAnswer) missingParams.push("correctAnswer");
        if (missingParams[0])
          return response
            .status(401)
            .send({
              message: `Missing parameter(s): ${missingParams.join(", ")}`,
            });
        return response
          .status(400)
          .send({ message: "Correct answer must be 1 or 0" });
      } else {
        return response.status(500).send("Very bad error in server logic");
      }
    }

    return response
      .status(201)
      .send({ message: "Question created successfully" });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
