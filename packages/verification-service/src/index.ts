import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";

// 1. Import the controller function directly
import { verifyCredentialController } from "./controllers/verification.controller";

const app: Express = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.use(express.json());

// 2. Define the route directly in this file
app.post("/verify", verifyCredentialController);

// Health check for testing
app.get("/health", (req, res) => res.send("Verification server is healthy!"));

// Central error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Verification service is running on http://localhost:${PORT}`);
});
