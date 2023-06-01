const Docker = require("docker-cli-js").Docker;
import dotenv from "dotenv";
import express, { query } from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";

dotenv.config();
const router = express.Router();

console.log("Loaded Test StartMc Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

router.use(express.json({type: "*/*"}))

router.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && err instanceof SyntaxError  && 'body' in err) {
      return res.status(400).send({ status: 400 }); // Bad request
  }
})

router.post("/", async (request, response) => {
  try {
    if (request.query.testId) {
    console.log(request.query.testId)
      let result: any = await (
        await connection
      ).query("SELECT state FROM tests WHERE id = ?", [request.query.testId]);
      if (result[0][0].state === "started") {
        return response.status(301).send("Server can start");
      }

      
      return response.status(401).send("Server is not allowed to start")
    }

    if (request.body.testId){
        await (
      await connection
    ).query("UPDATE tests SET state = 'started' WHERE id = ?", [
      request.body.testId,
    ]);

    return response.status(200).send("ok");
    }
  
  } catch (error) {
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
