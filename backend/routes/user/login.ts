import crypto from "crypto";
import dotenv from "dotenv";
import express, { response } from "express";
dotenv.config();
import cors from "cors";
const router = express.Router();

// enable Cross-Origin Resource Sharing
router.use(cors());

// import database connection object and helper functions
import { connection } from "../../functions/DB_Connection";
import { usernameValidator } from "../../functions/usernameValidator.js";

console.log("Loaded User Login Endpoint");

router.use(express.json({type: "*/*"}))

router.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && err instanceof SyntaxError  && 'body' in err) {
      return res.status(400).send({ status: 400 }); // Bad request
  }
  next();
});


// handle POST requests to register new users
router.post("/" , async (request, response) => {
  try {

    if(!request.body){
      return response.status(400).send({message :"Bad Request"})
    }
    const { username, password } = request.body;

    // check for missing parameters
    if (!username || !password) {
      return response
        .status(401)
        .send({ message: "Missing username or password" });
    }

    // validate the username
    let result: any = usernameValidator(username);
    if (result != 0) {
      return response
        .status(401)
        .send({ error: "Username is not valid" });
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
    const token = crypto.randomBytes(50).toString("hex");
    
     response.status(201).send({ token: token });

    // insert the token into the database
    await (await connection).query(
      "INSERT INTO tokens (username, token) VALUES (?,?)",
      [username, token]
    );

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
