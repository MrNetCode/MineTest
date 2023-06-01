const Docker = require("docker-cli-js").Docker;
import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";
dotenv.config();
const router = express.Router();

console.log("Loaded Test Stop Minecraft Server Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

let docker = new Docker

router.use(express.json({type: "*/*"}))

router.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && err instanceof SyntaxError  && 'body' in err) {
      return res.status(400).send({ status: 400 }); // Bad request
  }
});

router.post("/", async (request, response) => {
  try {
    if (!request.query.testId) {
      return response.status(400).send("bad request");
    }
    let result: any = await (
      await connection
    ).query("SELECT state FROM tests WHERE id = ?", [request.query.testId]);

      if(!result[0][0] || (result[0][0].state!="started" && result[0][0].state!="waiting")){
      result = await (
        await connection
      ).query("UPDATE tests SET state='stale' WHERE id=?", [request.query.testId]);
      return response.status(401).send("Server is not running")
    }

      let data = await docker.command(`stop ${request.query.testId}>/dev/null 2>&1`)
      await docker.command(`rmi minetest:${request.query.testId}>/dev/null 2>&1`)
      
        result = await (
      await connection
    ).query("UPDATE tests SET state='stale' WHERE id=?", [request.query.testId]);

        return response.status(200).send("Server Stopped, Container and image deleted");
        
    
  } catch (error) {
    await (
      await connection
    ).query("UPDATE tests SET state='stale' WHERE id=?", [request.query.testId]);
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
