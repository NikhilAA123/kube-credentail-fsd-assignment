import { Router } from "express";
import { issueCredential } from "../controllers/issuance.controller";

const router = Router();

// Define the POST route for '/issue' and link it to the controller logic.
router.post("/issue", issueCredential);

export default router;
