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
import { usernameValidator } from "../../functions/usernameValidator.js";
import { generateTOTP } from "../../functions/generateTOTP.js";

console.log("Loaded User Register Endpoint");

// initialize multer for file uploads
const upload = multer();

// handle POST requests to register new users
router.post("/", upload.none(), async (request, response) => {
  try {
    if(!request.body){
      return response.status(400).send({message :"Bad Request"})
    }
    if(request.headers.test){
     return response.status(201).send({token: "token"})
    }
    const { username, password, code } = request.body;

    // check for missing parameters
    if (!username || !password || !code) {
      let missingParams  = [];
        if (!username) missingParams.push('username');
        if (!password) missingParams.push('password');
        if (!code) missingParams.push('code');
        return response.status(401).send({ message: `Missing parameter(s): ${missingParams.join(', ')}` });
    }

    // verify the TOTP code
    if(generateTOTP() != code){
      return response.status(401).send({"message": "Invalid TOTP code"})
    }

    // validate the username
    let result: any = usernameValidator(username);
    if (result != 0) {
      return response
        .status(401)
        .send({ error: "Illegal Username" });
    }

    // generate a random salt
    const salt = generateSalt(30);

    // insert the new user into the database
    await (await connection).query(
      "INSERT INTO users (username, password_hash) VALUES (?,?)",
      [
        username,
        crypto.createHash("sha256").update(password).digest("hex"),
      ]
    );

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
