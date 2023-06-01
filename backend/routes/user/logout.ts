import dotenv from "dotenv";
import express from "express";
dotenv.config();
import cors from "cors";

const router = express.Router();

// enable Cross-Origin Resource Sharing
router.use(cors());

// import database connection object and helper functions
import { connection } from "../../functions/DB_Connection";

console.log("Loaded User Logout Endpoint");

router.use(express.json({type: "*/*"}))

router.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && err instanceof SyntaxError  && 'body' in err) {
      return res.status(400).send({ status: 400 }); // Bad request
  }
  next();
});
// handle POST requests to register new users
router.post("/", async (request, response) => {
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
