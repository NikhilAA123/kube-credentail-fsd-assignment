import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // 1. Import the cors library
import issuanceRoutes from "./routes/issuance.routes";

const app = express();
const PORT = process.env.PORT || 8081; // 2. Changed port to 8081 for consistency

// 3. Add the cors middleware to allow requests from the frontend
app.use(cors());
app.use(express.json());
app.use("/", issuanceRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on the server.",
  });
});

app.listen(PORT, () => {
  console.log(`Issuance service is running on http://localhost:${PORT}`);
});
