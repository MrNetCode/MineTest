import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";
import multer from "multer";

dotenv.config();
const router = express.Router();

console.log("Loaded Question Create Endpoint")

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

    const { token, type, testId, question, choice1, choice2, choice3, choice4, choice5, correctAnswer } = request.body;

    // check for missing parameters
    if (!token || !type || !testId || !question) {
      return response.status(401).send({ message: "Missing parameter(s)" });
    }

    // check the token against the database
    const result: any = await (await connection).query("SELECT username FROM tokens WHERE token = ?", [token]);

    if (result[0].length === 0) {
      return response.status(401).send({ message: "Invalid token" });
    }

    // insert question into database
    const questionId = crypto.randomUUID();

    await (await connection).query("INSERT INTO questions (id, test, type, text) VALUES (?, ?, ?, ?)", [
      questionId,
      testId,
      type,
      question
    ]);


    // insert multi-choice or true-false question into database, if applicable
    if (type === "multi" && choice1 && choice2) {
      await (await connection).query(
        "INSERT INTO multi_choice (id, choice1, choice2, choice3, choice4, choice5, correct) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [questionId, choice1, choice2, choice3, choice4, choice5, correctAnswer]
      );
    } else if (type === "true-false" && typeof correctAnswer === "boolean") {
      await (await connection).query(
        "INSERT INTO true_false (id, question_id, text, answer) VALUES (?, ?, ?, ?)",
        [crypto.randomUUID(), questionId, question, correctAnswer]
      );
    } else {
      return response.status(401).send({ message: "Invalid type or missing parameters" });
    }

    return response.status(200).send({ message: "Question created successfully" });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
