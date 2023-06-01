import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";

dotenv.config();
const router = express.Router();

console.log("Loaded Question Delete Endpoint")

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
        return response.status(400).send({ message: "Bad Request" });
      }
  
      const { questionId, token } = request.body;
  
      let missingParams = [];
      // check for missing parameters
      if (!token || !questionId) {
        if (!token) missingParams.push('token');
        if (!questionId) missingParams.push('questionId');
        return response.status(401).send({ message: `Missing parameter(s): ${missingParams.join(', ')}` });
      }
  
      // check the token against the database
      let result: any = await (await connection).query("SELECT username FROM tokens WHERE token = ?", [token]);


      if (result[0].length === 0) {
        return response.status(401).send({ message: "Invalid token" });
      }

      const result2: any = await (await connection).query("SELECT t.owner FROM questions q JOIN tests t ON q.test = t.id WHERE q.id = ?;", [questionId]);
      

      if(!result2[0].length || result[0].length === 0){
        return response.status(404).send({"message":"Not Found"})
      }

      if(result2[0][0].owner != result[0][0].username){
        return response.status(401).send({message: "You don't have permission to modify this item"})
      }

      result = await (await connection).query("DELETE FROM questions WHERE id=?", [questionId]);

      response.send()

    } catch (error) {
      console.log(error);
      return response.status(500).send({ message: "Internal Server Error" });
    }
  });
  
  export default router