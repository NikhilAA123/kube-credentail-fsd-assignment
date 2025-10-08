import * as express from "express";
import { verifyCredential } from "../controllers/verification.controller";

const router = express.Router();

// Define the POST route for verification
router.post("/verify", verifyCredential);

export default router;
