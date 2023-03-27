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
      const result: any = await (await connection).query("SELECT username FROM tokens WHERE token = ?", [token]);

      console.log(result[0][0].username)

      if (result[0].length === 0) {
        return response.status(401).send({ message: "Invalid token" });
      }

      const result2: any = await (await connection).query("SELECT t.owner FROM questions q JOIN tests t ON q.test = t.id WHERE q.id = ?;", [questionId]);


      if(result2[0][0].owner != result[0][0].username){
        return response.status(401).send({message: "You don't have permission to modify this item"})
      }
//TODO: Fix this(not working)
      await (await connection).query("UPDATE CASE WHEN Questions.type = 'multi' THEN multi_choice WHEN Questions.type = 'true-false' THEN true_false ELSE NULL END AS answer_table SET answer_table.correctAnswer = ? FROM Questions LEFT JOIN Multi_choice ON Questions.id = Multi_choice.id LEFT JOIN True_false ON Questions.id = True_false.id WHERE Questions.id = ?;", [correctAnswer, questionId]);

      response.send({"message":"Updated Succesfully"})

    } catch (error) {
      console.log(error);
      return response.status(500).send({ message: "Internal Server Error" });
    }
  });
  
  export default router