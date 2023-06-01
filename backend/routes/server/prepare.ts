const Docker = require("docker-cli-js").Docker;
import { writeCommandFile } from "../../functions/writeCommandFile";
import dotenv from "dotenv";
import express from "express";
import { connection } from "../../functions/DB_Connection";
import cors from "cors";
import { writeBlockDBFile } from "../../functions/writeBlockDBFile";
import { writeSchedulerFile } from "../../functions/writeScheduler";

dotenv.config();
const router = express.Router();

console.log("Loaded Test Prepare Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

router.use(express.json({ type: "*/*" }));

router.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && err instanceof SyntaxError && "body" in err) {
    return res.status(400).send({ status: 400 }); // Bad request
  }
});

router.post("/", async (request, response) => {
  try {
    if (!request.body) {
      return response.status(400).send({ message: "Bad request" });
    }
    const { testId, map, game } = request.body;
    if (!testId) {
      return response.status(401).send({ message: "Missing testId" });
    }
    let result: any = await (
      await connection
    ).query("SELECT state FROM tests WHERE id = ?", [testId]);

    if (!result[0][0] || result[0][0].state === "prepared") {
      return response.status(304).send({ message: "Test is already prepared" });
    }

    result = await (
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

    if (result[0].length === 0) {
      return response.status(404).send({ message: "Test Not Found" });
    }

    const questions = result[0];
    let commandFile: any = "";
    let schedulerFile: any;
    let blockDatabase: any;

    const fs = require("fs");
    let folderName = testId;
    //replace in the future with map
    if (true && questions.length < 21) {
      commandFile = writeCommandFile(questions, testId);
      blockDatabase = writeBlockDBFile(questions);
      schedulerFile = writeSchedulerFile(questions);
      await fs.cpSync("./server/map1", `./server/build/${folderName}`, {
        recursive: true,
      });
      // read the file contents

      let configFileDemo = fs.readFileSync(
        `./server/build/${folderName}/plugins/demo/config.yml`,
        "utf8"
      );

      // add the string at the start

      configFileDemo =
        `questions: ${questions.length}
` + configFileDemo;

      // write the modified file contents back to the file
      fs.writeFileSync(
        `./server/build/${folderName}/plugins/demo/config.yml`,
        configFileDemo,
        "utf8"
      );

      await fs.writeFileSync(
        `./server/build/${folderName}/plugins/MyCommand/commands/minetest.yml`,
        commandFile
      );
      await fs.writeFileSync(
        `./server/build/${folderName}/plugins/MyCommand/blockdatabase.yml`,
        blockDatabase
      );
      await fs.writeFileSync(
        `./server/build/${folderName}/plugins/MyCommand/scheduler.yml`,
        schedulerFile
      );
    } else if (map === 2) {
    } else {
      return response.status(409).send("Too many questions for this map");
    }

    const docker = new Docker();

    // Define the Dockerfile contents as a variable

    try {
      const imageName = `minetest:${folderName}`;
      await docker.command(
        `build -t ${imageName} ./server/build/${folderName} >/dev/null 2>&1`
      );
    } catch (err) {
      result = await (
        await connection
      ).query("UPDATE tests SET state='stale' WHERE id=?", [
        request.query.testId,
      ]);

      console.error(err);
      return result
        .send(500)
        .send({ message: "Error: Docker Image Failed to build" });
    }

    await (
      await connection
    ).query("UPDATE tests SET state = 'prepared' WHERE id = ?", [testId]);

     fs.rmSync(`./server/build/${folderName}`, { recursive: true });

    return response.send({ message: "Test prepared - No errors found" });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
