import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";

dotenv.config();
const router = express.Router();

console.log("Loaded Test Answer Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

router.use(express.json({type: "*/*"}))

router.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && err instanceof SyntaxError  && 'body' in err) {
      return res.status(400).send({ status: 400 }); // Bad request
  }
});

router.get("/", async (request: any, response) => {
  try {
    // console.log(request.query.testId, request.body.testId);
    if (!request.query.id || !request.query.player || !request.query.answer || !request.query.testId) {
      return response.status(400).send("bad request");
    }
    request.query.answer = decodeURIComponent(request.query.answer)
    console.log(request.query.answer, request.query.player, request.query.id)
    let result: any = await (
      await connection
    ).query(
      "SELECT * FROM answers WHERE player=? AND questionId=?",
      [request.query.player, request.query.id]
    );
    console.log(result[0]);
    if (!result[0][0]) {
      await (
        await connection
      ).query("INSERT INTO answers (answer, player, questionId, testId) VALUES (?,?,?,?)", [
        request.query.answer,
        request.query.player,
        request.query.id,
        request.query.testId
      ]);
      return response.send("ok");
    }

    await (
      await connection
    ).query("UPDATE answers SET answer=?, player=?, questionId=? WHERE answer=? AND player=? AND questionId=?", [
      request.query.answer,
      request.query.player,
      request.query.id,
      result[0][0].answer,
      result[0][0].player,
      result[0][0].questionId,
    ]);

    return response.status(200).send("Answer Registered");
  } catch (error: any) {
    console.log(error);
    if(error.errno === 1452){
       return response.status(500).send({ error: "TestId doesnt exists on database" });
    }
    return response.status(500).send({ error: "Internal server error" });
  }
});

router.post("/", async (request, response) => {
  try {
    // console.log(request.query.testId, request.body.testId);
    if (!request.body || !request.body.testId || !request.body.token) {
      return response.status(400).send("bad request");
    }

    let result: any = await (
      await connection
    ).query(
      `SELECT q.text AS question_text, 
      CASE q.type
           WHEN 'true-false' THEN 
                CASE tf.correct
                     WHEN 1 THEN 'True'
                     WHEN 0 THEN 'False'
                END
           WHEN 'multi' THEN mc.correct
           ELSE ''
      END AS correct_answer,
      CASE q.type
           WHEN 'true-false' THEN 
                CASE a.answer
                     WHEN '1' THEN 'True'
                     WHEN '0' THEN 'False'
                END
           WHEN 'multi' THEN
                CASE a.answer
                     WHEN '1' THEN mc.choice1
                     WHEN '2' THEN mc.choice2
                     WHEN '3' THEN mc.choice3
                     WHEN '4' THEN mc.choice4
                     WHEN '5' THEN mc.choice5
                END
           ELSE a.answer
      END AS player_answer,
      CASE 
           WHEN q.type = 'true-false' AND tf.correct = a.answer THEN 1
           WHEN q.type = 'multi' AND mc.correct = a.answer THEN 1
           ELSE 0
      END AS is_correct,
      a.player
FROM answers a
JOIN questions q ON a.questionId = q.id
LEFT JOIN true_false tf ON q.id = tf.id AND q.type = 'true-false'
LEFT JOIN multi_choice mc ON q.id = mc.id AND q.type = 'multi'
WHERE a.testId = ? ORDER BY question_text ASC;
`,
      [request.body.testId]
    );

    response.send({"answers": result[0]})
  } catch (error) {
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
