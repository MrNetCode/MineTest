import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
import cors from "cors";
import multer from "multer";

const router = express.Router();

// enable Cross-Origin Resource Sharing
router.use(cors());

// import database connection object and helper functions
import { connection } from "../../functions/DB_Connection";

console.log("Loaded Test Delete Endpoint");

// initialize multer for file uploads
const upload = multer();

// handle POST requests to register new users
router.post("/", upload.none(), async (request, response) => {
  try {
    if (!request.body) {
      return response.status(400).send({ message: "Bad Request" });
    }
    const { token, testId } = request.body;

    // check for missing parameters
    if (!token || !testId) {
      let missingParams  = [];
        if (!token) missingParams.push('token');
        if (!testId) missingParams.push('testId');
        return response.status(401).send({ message: `Missing parameter(s): ${missingParams.join(', ')}` });
    }

    let result: any = await (
      await connection
    ).query("SELECT username FROM tokens where token = ?", [token]);

    if (result[0].length === 0) {
      return response.status(401).send({ message: "Invalid token" });
    }

   let result2: any = await (
      await connection
    ).query("SELECT owner FROM tests WHERE id = ?", [testId]);



if(!result2[0][0]){
    return response.status(404).send()
}
    if(result2[0][0].owner != result[0][0].username){
        return response.status(401).send({"message":"Only the test owner can delete this test"})
    }

    await (
        await connection
      ).query("DELETE FROM tests WHERE id = ?", [testId]);
  

    return response.status(200).send();

  } catch (error: any) {
    // handle errors
    if (error.errno === 1062) {
      return response.status(409).send({ error: "email or username in use" });
    }
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

// export the router object
export default router;
