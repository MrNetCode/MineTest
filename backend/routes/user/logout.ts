import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
import cors from "cors";
import multer from "multer";

const router = express.Router();

// enable Cross-Origin Resource Sharing
router.use(cors());

const upload = multer()

// import database connection object and helper functions
import { connection } from "../../functions/DB_Connection";

console.log("Loaded User Logout Endpoint");

// handle POST requests to logout users
router.post("/", upload.none(), async (request, response) => {
  try {
    if (!request.body || !request.body.token) {
      return response.status(400).send({ message: "Bad Request" });
    }

if(request.body.logoutFromAll){

    let result: any = await (await connection).query("SELECT username FROM tokens WHERE token = ?", [
        request.body.token,
      ]);

    if(!result[0][0]){
        return response.status(401).send({message: "Invalid Token"})
    }
  
    await (await connection).query("DELETE FROM tokens WHERE username = ?", [
        result[0][0].username,
      ]);
  
      return response.status(200).send({ message: "Logged out from all" });
}
    // delete the token from the database
    await (await connection).query("DELETE FROM tokens WHERE token = ?", [
      request.body.token,
    ]);

    return response.status(200).send({ message: "Logged out successfully" });
  } catch (error: any) {
    // handle errors
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

// export the router object
export default router;
