import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import verificationRoutes from "./routes/verification.routes";

const app = express();
const PORT = process.env.PORT || 8082;
const HOST = "0.0.0.0"; // Listen on all network interfaces, crucial for Docker/PaaS

// --- Professional CORS Configuration ---
// This setup allows requests from your live Vercel URL and your local development server.
const allowedOrigins = [
  "https://kube-credentail-fsd-assignment.vercel.app",
  "http://localhost:5173",
  "https://app.44.220.16.109.nip.io", // <-- Add your nip.io frontend URL here
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or server-to-server requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      callback(new Error(msg), false);
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};

// The 'cors' middleware, when used like this, handles pre-flight OPTIONS requests automatically.
app.use(cors(corsOptions));
// --- End of CORS Configuration ---

app.use(express.json());
app.use("/", verificationRoutes);
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

// Centralized error handler to catch any unexpected errors.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Final server listener, ready for cloud deployment.
app.listen(Number(PORT), HOST, () => {
  console.log(`Verification service is running on http://${HOST}:${PORT}`);
});
