import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";

dotenv.config();
const router = express.Router();

console.log("Loaded Question Fetch Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

router.use(express.json({type: "*/*"}))

router.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && err instanceof SyntaxError  && 'body' in err) {
      return res.status(400).send({ status: 400 }); // Bad request
  }
});


router.post("/", async (request, response) => {
  try {
    if (!request.body) {
      return response.status(400).send({ message: "Bad request" });
    }
    const { testId, token } = request.body;

    if (!testId || !token) {
      return response.status(401).send({ message: "Missing testId or token" });
    }

       // check the token against the database
       let tokenResult: any = await (await connection).query("SELECT username FROM tokens WHERE token = ?", [token]);

       if (!tokenResult[0].length || tokenResult[0].length === 0 || !tokenResult[0][0].username) {
         return response.status(401).send({ message: "Invalid token" });
       }
 
       const result2: any = await (await connection).query("SELECT id FROM tests WHERE owner = ?;", [tokenResult[0][0].username]);
       
 
       if(!result2[0].length || result2[0].length === 0){
         return response.status(404).send({"message":"Not Found"})
       }

    const result: any = await (
      await connection
    ).query(
      `
      SELECT q.id, q.type, q.text, mc.choice1, mc.choice2, mc.choice3, mc.choice4, mc.choice5, 
    CASE WHEN q.type = 'true-false' THEN tf.correct ELSE mc.correct END AS correctAnswer
FROM questions q
LEFT JOIN multi_choice mc ON q.id = mc.id
LEFT JOIN true_false tf ON q.id = tf.id
WHERE q.test = ? ORDER BY q.order;
`,
      [testId]
    );

    const questions = result[0];
    return response.status(200).send({ question: questions });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
