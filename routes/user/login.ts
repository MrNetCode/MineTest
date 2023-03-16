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
import { usernameValidator } from "../../functions/usernameValidator.js";

console.log("Loaded User Login Endpoint");

// initialize multer for file uploads
const upload = multer();

// handle POST requests to register new users
router.post("/", upload.none(), async (request, response) => {
  try {
    const { username, password } = request.body;

    // check for missing parameters
    if (!username || !password) {
      return response
        .status(401)
        .send({ message: "missing username or password" });
    }

    // validate the username
    let result: any = usernameValidator(username);
    if (result != 0) {
      return response
        .status(401)
        .send({ error: "Illegal Username" });
    }

    // insert the new user into the database
   result =  await (await connection).query(
      "SELECT 1 FROM users WHERE username = ? AND password_hash = ?",
      [
        username,
        crypto.createHash("sha256").update(password).digest("hex"),
      ]
    );

  if(result[0].length=== 0){
    return response.status(401).send({message: "Invalid Username or password"})
  }

    // generate a random token
    const token = crypto.randomBytes(30).toString("hex");

    // insert the token into the database
    await (await connection).query(
      "INSERT INTO tokens (username, token) VALUES (?,?)",
      [username, token]
    );

    // return the token to the client
    return response.status(201).send({ token: token });

  } catch (error: any) {
    // handle errors
    if(error.errno===1062){
      return response.status(409).send({ error: "email or username in use" });
    }
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

// export the router object
export default router;
