import { Router } from "express";
import { verifyCredentialController } from "../controllers/verification.controller";

const router = Router();

// Let's define the route directly on the root of the router.
router.route("/verify").post(verifyCredentialController);

export default router;
