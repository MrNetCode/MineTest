import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";
import multer, { memoryStorage } from "multer";

dotenv.config();
const router = express.Router();

console.log("Loaded Question Edit Endpoint")

// enable Cross-Origin Resource Sharing
router.use(cors());

// initialize multer for file uploads
const upload = multer();


// handle PUT requests to update existing questions
router.put("/", upload.none(), async (request, response) => {
    try {
      if (!request.body) {
        return response.status(400).send({ message: "Bad Request" });
      }
  
      const { questionId, token, correctAnswer } = request.body;
  
      let missingParams = [];
      // check for missing parameters
      if (!token || !questionId || !correctAnswer) {
        if (!token) missingParams.push('token');
        if (!questionId) missingParams.push('questionId');
        if(!correctAnswer) missingParams.push('correctAnswer')
        return response.status(401).send({ message: `Missing parameter(s): ${missingParams.join(', ')}` });
      }
  
      // check the token against the database
      let result: any = await (await connection).query("SELECT username FROM tokens WHERE token = ?", [token]);

      console.log(result[0][0].username)

      if (result[0].length === 0) {
        return response.status(401).send({ message: "Invalid token" });
      }

      const result2: any = await (await connection).query("SELECT t.owner FROM questions q JOIN tests t ON q.test = t.id WHERE q.id = ?;", [questionId]);


      if(result2[0][0].owner != result[0][0].username){
        return response.status(401).send({message: "You don't have permission to modify this item"})
      }
//TODO: Fix this(not working)
      result = await (await connection).query("SELECT type FROM questions WHERE id=?", [questionId]);

      console.log(result[0][0].type)

      if(result[0][0].type="true-false") {
        if(correctAnswer!=0 && correctAnswer!=1){
          return response.status(400).send({message:"Bad correctAnswer value(must be 1 or 0)"})
        }
        await (await connection).query(`UPDATE 
        true_false 
        JOIN questions ON true_false.id = questions.id 
      SET 
        true_false.correct = ?
      WHERE 
        questions.id = ?
        AND questions.type = 'true-false';`, [correctAnswer, questionId])
      }

      response.send({"message":"Updated Succesfully"})

    } catch (error) {
      console.log(error);
      return response.status(500).send({ message: "Internal Server Error" });
    }
  });
  
  export default router