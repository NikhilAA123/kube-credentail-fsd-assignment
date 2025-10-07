import express, { Request, Response, NextFunction } from "express";
import issuanceRoutes from "./routes/issuance.routes";

const app = express(); // <-- No more .default()
const PORT = process.env.PORT || 3001;

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
