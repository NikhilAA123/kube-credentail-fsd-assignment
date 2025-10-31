import { Router } from "express";
import { issueCredential } from "../controllers/issuance.controller";
import { getAllCredentials } from "../controllers/credentials.controller";

const router = Router();

/**
 * @route POST /issue
 * @desc Issue a new verifiable credential
 * @access Public (JWT validation can be added later)
 */
router.post("/issue", issueCredential);

/**
 * @route GET /credentials
 * @desc Fetch all issued credentials (for admin/debug view)
 * @access Public (should be restricted later)
 */
router.get("/credentials", getAllCredentials);

export default router;
