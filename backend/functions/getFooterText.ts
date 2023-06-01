import express, { query } from "express";
import cors from "cors";
import multer from "multer";

const router = express.Router();

console.log("Loaded Footer Fetch Endpoint");

// enable Cross-Origin Resource Sharing
router.use(cors());

// initialize multer for file uploads
const upload = multer();

// handle POST requests to create new questions
router.get("/", upload.none(), async (request, response) => {
  try {
   return response.send({"footer": "MineTest Platform - v1.1.0 - Stable Release"})
  
  } catch (error) {
    console.log(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

export default router;
