import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import verificationRoutes from "./routes/verification.routes";

const app = express();
const PORT = process.env.PORT || 8082;
const HOST = "0.0.0.0"; // Listen on all network interfaces, crucial for Docker/PaaS

// --- Professional CORS Configuration ---
// This setup allows requests from your live Vercel URL and your local development server.
const allowedOrigins = [
  "https://kube-credentail-fsd-assignment.vercel.app", // Your live Vercel URL
  "http://localhost:5173", // Your local development URL
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or server-to-server requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200, // For legacy browser support
};

// Handle OPTIONS requests for CORS preflight, which browsers send for security.
app.options("*", cors(corsOptions));

// Enable CORS for all other requests (e.g., POST, GET).
app.use(cors(corsOptions));
// --- End of CORS Configuration ---

app.use(express.json());
app.use("/", verificationRoutes);

// Centralized error handler to catch any unexpected errors.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Final server listener, ready for cloud deployment.
app.listen(Number(PORT), HOST, () => {
  console.log(`Verification service is running on http://${HOST}:${PORT}`);
});
