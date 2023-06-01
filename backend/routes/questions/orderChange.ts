import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import { shiftTestOrderAndSaveToDB } from "../../functions/shiftTest";
import cors from "cors";

dotenv.config();
const router = express.Router();

console.log("Loaded Question Order Move Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

router.use(express.json({type: "*/*"}))

router.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && err instanceof SyntaxError  && 'body' in err) {
      return res.status(400).send({ status: 400 }); // Bad request
  }
});

router.put("/", async (request, response) => {
  try {
    if (!request.body) {
      return response.status(400).send({ message: "Bad Request" });
    }

    const { questionId, move, token } = request.body;

    let missingParams = [];
    // check for missing parameters
    if (!token || !questionId || !move) {
      if (!token) missingParams.push("token");
      if (!questionId) missingParams.push("questionId");
      if (!move) missingParams.push("move");
      return response
        .status(401)
        .send({ message: `Missing parameter(s): ${missingParams.join(", ")}` });
    }

    if (move !== "1" && move !== "-1") {
      return response.status(400).send({ message: "move must be 1 or -1" });
    }

    // check the token against the database
    let result: any = await (
      await connection
    ).query("SELECT username FROM tokens WHERE token = ?", [token]);

    if (result[0].length === 0) {
      return response.status(401).send({ message: "Invalid token" });
    }

    const result2: any = await (
      await connection
    ).query(
      "SELECT q.test, t.owner FROM questions q JOIN tests t ON q.test = t.id WHERE q.id = ?;",
      [questionId]
    );

    if (result2[0][0].owner !== result[0][0].username) {
      return response
        .status(401)
        .send({ message: "You don't have permission to modify this item" });
    }

    result = await (
      await connection
    ).query("SELECT `order` FROM questions WHERE id=?", [questionId]);

    const currentOrder = result[0][0].order;
    
    let newOrder: number;

    if (move === "1") {
      newOrder = currentOrder + 1;
    } else {
      newOrder = currentOrder - 1;
    }

    result = await (
      await connection
    ).query(
      "SELECT id, `order` FROM questions WHERE test = ? AND `order` = ?",
      [result2[0][0].test, newOrder]
    );

    if (result[0].length === 0) {
      // There is no question with the desired order. Update the question's order and return success
      await (
        await connection
      ).query("UPDATE questions SET `order` = ? WHERE id = ?", [
        newOrder,
        questionId,
      ]);

      // Update the test's question order in the database
      result = await (
        await connection
      ).query("SELECT * FROM questions WHERE test = ?", [result2[0][0].test]);
      shiftTestOrderAndSaveToDB(result[0]);

      return response.send({ message: "Updated successfully" });
    }

    // A question with the desired order exists. Swap the two questions' orders
    const newQuestionOrder = currentOrder + (move === "1" ? 1 : -1);

    const existingQuestionId = result[0][0].id;
    const existingQuestionOrder = result[0][0].order;

    // Update the order of the existing question to the current question's order
    await (
      await connection
    ).query("UPDATE questions SET `order` = ? WHERE id = ?", [
      currentOrder,
      existingQuestionId,
    ]);

    // Update the order of the current question to the existing question's order
    await (
      await connection
    ).query("UPDATE questions SET `order` = ? WHERE id = ?", [
      existingQuestionOrder,
      questionId,
    ]);

    // Update the test's question order in the database
    result = await (
      await connection
    ).query("SELECT * FROM questions WHERE test = ?", [result2[0][0].test]);

    shiftTestOrderAndSaveToDB(result[0]);
    return response.send({ message: "Updated" });
  } catch (error) {
    console.error(error);
    return response.status(500).send({ message: "Server error" });
  }
});

export default router;