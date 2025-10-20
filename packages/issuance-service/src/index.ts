import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import issuanceRoutes from "./routes/issuance.routes";

const app = express();
const PORT = process.env.PORT || 8081;
const HOST = "0.0.0.0";

const allowedOrigins = [
  "https://kube-credentail-fsd-assignment.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

// The 'cors' middleware, when used like this, handles pre-flight requests automatically.
app.use(cors(corsOptions));

app.use(express.json());
app.use("/", issuanceRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on the server.",
  });
});

app.listen(Number(PORT), HOST, () => {
  console.log(`Issuance service is running on http://${HOST}:${PORT}`);
});
