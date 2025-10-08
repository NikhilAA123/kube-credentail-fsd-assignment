import express, { Express, Request, Response, NextFunction } from "express";
import verificationRoutes from "./routes/verification.routes";

const app: Express = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.use("/", verificationRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Verification service is running on http://localhost:${PORT}`);
});
