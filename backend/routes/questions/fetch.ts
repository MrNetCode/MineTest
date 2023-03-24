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
        if(!request.body){
            return response.status(400).send({message :"Bad request"})
        }
      const { testId } = request.body;
  if(!testId){
    return response.status(401).send({message :"Missing testId"})
  }
      const result: any = await (await connection).query(`
      SELECT q.id, q.type, q.text, mc.choice1, mc.choice2, mc.choice3, mc.choice4, mc.choice5, 
    CASE WHEN q.type = 'true-false' THEN tf.correct ELSE mc.correct END AS correctAnswer
FROM questions q
LEFT JOIN multi_choice mc ON q.id = mc.id
LEFT JOIN true_false tf ON q.id = tf.id
WHERE q.test = ? ORDER BY q.order;
`, [testId]);

      const questions = result[0];
      return response.status(200).send({ "question": questions });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error: "Internal server error" });
    }
  });
  
  export default router