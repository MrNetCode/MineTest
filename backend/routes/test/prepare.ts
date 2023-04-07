import { writeCommandFile } from "../../functions/writeCommandFile";
import fs from "fs";
import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";
import multer from "multer";
import crypto from "crypto"
import { writeSchedulerFile } from "../../functions/writeSchedulerFile";

dotenv.config();
const router = express.Router();

console.log("Loaded Test Prepare Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

// initialize multer for file uploads
const upload = multer();

// handle POST requests to create new questions
router.post("/", upload.none(), async (request, response) => {
  try {
    if (!request.body) {
      return response.status(400).send({ message: "Bad request" });
    }
    const { testId, mapId } = request.body;
    if (!testId) {
      return response.status(401).send({ message: "Missing testId" });
    }
    const result: any = await (
      await connection
    ).query(
      `
      SELECT q.id, q.type, q.text, mc.choice1, mc.choice2, mc.choice3, mc.choice4, mc.choice5, 
    CASE WHEN q.type = 'true-false' THEN tf.correct ELSE mc.correct END AS correctAnswer
FROM questions q
LEFT JOIN multi_choice mc ON q.id = mc.id
LEFT JOIN true_false tf ON q.id = tf.id
WHERE q.test = ? ORDER BY q.order;
`,
      [testId]
    );

    const questions = result[0];
    let commandFile: any = ''
    let schedulerFile: any
    let blockDatabase: any

  commandFile = writeCommandFile(questions)
  console.log(writeSchedulerFile(questions))

    console.log(commandFile);

    const fs = require("fs");
    //replace in the future with mapId
    if(false){
      let folderName = crypto.randomBytes(4).toString("hex")
            await fs.cpSync("./server/map1", `./server/build/${folderName}`, {recursive: true});
              console.log('Folder copied successfully!');

              await fs.writeFileSync(`./server/build/${folderName}/plugins/MyCommand/commands/minetest.yml`, commandFile);
              console.log("File commands written successfully!")

    }else("mapId = 2");{

    }

    
    return response.send({message : "Not Implemented yet!"})
  } catch (error) {
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
