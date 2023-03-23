import { generateSalt } from "../../functions/generateSalt.js";
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

console.log("Loaded Test Create Endpoint");

// initialize multer for file uploads
const upload = multer();

// handle POST requests to register new users
router.post("/", upload.none(), async (request, response) => {
  try {
    if (!request.body) {
      return response.status(400).send({ message: "Bad Request" });
    }
    const { token, name } = request.body;

    // check for missing parameters
    if (!token || !name) {
      let missingParams  = [];
        if (!token) missingParams.push('token');
        if (!name) missingParams.push('name');
        return response.status(401).send({ message: `Missing parameter(s): ${missingParams.join(', ')}` });
    }

    //? check the token(get username) from the database

    let result: any = await (
      await connection
    ).query("SELECT username FROM tokens where token = ?", [token]);

    if (result[0].length === 0) {
      return response.status(401).send({ message: "Invalid token" });
    }

    let testId = crypto.randomUUID()
    // insert the test into the database
    await (
      await connection
    ).query("INSERT INTO tests (id, name, owner) VALUES (?,?,?)", [
     testId,
      name,
      result[0][0].username,
    ]);

    // return the created message
    return response.status(201).send({ message: "Created", "testId": testId});
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
