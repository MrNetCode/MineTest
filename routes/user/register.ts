import { generateSalt } from "../../functions/generateSalt.js";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
import cors from "cors";
import multer from "multer";
const router = express.Router();

router.use(cors());

import { connection } from "../../functions/DB_Connection";
import { usernameValidator } from "../../functions/usernameValidator.js";
import { generateTOTP } from "../../functions/generateTOTP.js";


console.log("Loaded User Register Endpoint");

const upload = multer();

router.post("/", upload.none(), async (request, response) => {
  try {
    const { username, password, code } = request.body;

    if (!username || !password || !code) {
      return response
        .status(401)
        .send({ message: "missing username, code or password" });
    }

    if(generateTOTP() != code){
      return response.status(401).send({"message": "Invalid TOTP code"})
    }

    let result: any = usernameValidator(username);
    if (result != 0) {
      return response
        .status(401)
        .send({ error: "Illegal Username" });
    }

    // Generate a random salt
    const salt = generateSalt(30);

    

    await (await connection).query(
      "INSERT INTO users (username, password_hash) VALUES (?,?)",
      [
        username,
        crypto.createHash("sha256").update(password).digest("hex"),
      ]
    );

    const token = crypto.randomBytes(30).toString("hex");

    await (await connection).query(
      "INSERT INTO tokens (username, token) VALUES (?,?)",
      [username, token]
    );

    return response.status(201).send({ token: token });

  } catch (error: any) {
    if(error.errno===1062){
      return response.status(409).send({ error: "email or username in use" });
    }
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
