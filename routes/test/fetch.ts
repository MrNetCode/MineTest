import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
import cors from "cors";
import multer from "multer";

const router = express.Router();

const upload = multer();
// enable Cross-Origin Resource Sharing
router.use(cors());

// import database connection object and helper functions
import { connection } from "../../functions/DB_Connection";

console.log("Loaded Test Fetch Endpoint");

// handle GET requests to fetch a test
router.post("/", upload.none(), async (request, response) => {
  try {
    if (!request.body) {
      return response.status(400).send({ message: "Bad Request" });
    }
    const { token, testId } = request.body;

    // check for missing parameters
    if (!token || !testId) {
      return response.status(400).send({ message: "missing token or testId" });
    }

    // check if token is valid
    let result: any = await (
      await connection
    ).query("SELECT username FROM tokens where token = ?", [token]);

    if (result[0].length === 0) {
      return response.status(401).send({ message: "Invalid token" });
    }

    // fetch the test from the database
    result = await (
      await connection
    ).query("SELECT * FROM tests WHERE id = ?", [testId]);

    if (result[0].length === 0) {
      return response.status(404).send({ message: "Test not found" });
    }

    const test = result[0][0];

    // check if the user has access to the test
    if (test.author !== result[0][0].username) {
      return response.status(403).send({ message: "Access denied" });
    }

    // return the test to the client
    return response.status(200).send({ test });
  } catch (error: any) {
    // handle errors
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

// export the router object
export default router;
