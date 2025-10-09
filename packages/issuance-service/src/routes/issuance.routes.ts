import { Router } from "express";
import { issueCredential } from "../controllers/issuance.controller";

const router = Router();

router.post("/issue", issueCredential);

export default router;
