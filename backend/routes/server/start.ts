const Docker = require("docker-cli-js").Docker;
import dotenv from "dotenv";
import express, { query } from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";
dotenv.config();
import crypto from "crypto"
const router = express.Router();

console.log("Loaded Test Start Minecraft Server Endpoint");

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
    if (!request.body.testId) {
      return response.status(400).send("bad request");
    }
    let result: any = await (
      await connection
    ).query("SELECT state FROM tests WHERE id = ?", [request.body.testId]);

      if(!result[0][0] || result[0][0].state!="prepared"){
        result = await (
          await connection
        ).query("UPDATE tests SET state='stale' WHERE id=?", [request.body.testId]);
        return response.status(401).send("Server is not prepared")}
        
        let port: any = crypto.randomInt(49152,65535)

      await docker.command(`run -d --rm --name ${request.body.testId} -p ${port}:25565  --add-host=host.docker.internal:host-gateway minetest:${request.body.testId} >/dev/null 2>&1`)
     

      
        result = await (
      await connection
    ).query("UPDATE tests SET state='waiting' WHERE id=?", [request.body.testId]);
   
      await (await connection).query("UPDATE tests SET port=? WHERE id=?", [port, request.body.testId]);

        return response.status(200).send({message : "Server is starting... Please wait 1 minute then try to connect", "port" :port});
        
    
  } catch (error) {
    await (
      await connection
    ).query("UPDATE tests SET state='stale' WHERE id=?", [request.body.testId]);
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
