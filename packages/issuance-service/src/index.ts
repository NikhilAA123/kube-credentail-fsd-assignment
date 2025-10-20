import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import issuanceRoutes from "./routes/issuance.routes";

const app = express();
const PORT = process.env.PORT || 8081;
const HOST = "0.0.0.0";

// --- This is the corrected, flexible CORS configuration ---
const allowedOrigins = [
  "https://kube-credentail-fsd-assignment.vercel.app", // Your live Vercel URL
  "http://localhost:5173", // Your local development URL
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
};

// Handle OPTIONS requests for CORS preflight
app.options("*", cors(corsOptions));

// Enable CORS for all other requests
app.use(cors(corsOptions));
// --- End of fix ---

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
