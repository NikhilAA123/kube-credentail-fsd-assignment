import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import issuanceRoutes from "./routes/issuance.routes";

const app = express();
const PORT = process.env.PORT || 8081;
const HOST = "0.0.0.0";

// ✅ Allowed frontend origins (local + Vercel + Ingress)
const allowedOrigins = [
  "https://kube-credentail-fsd-assignment.vercel.app",
  "http://localhost:5173",
  /\.nip\.io$/, // allow your Ingress test domains like app.44.220.16.109.nip.io
];

// ✅ Dynamic CORS validation
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (
      !origin ||
      allowedOrigins.some((allowed) =>
        typeof allowed === "string" ? allowed === origin : allowed.test(origin)
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

// ✅ Use middlewares
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Routes
app.use("/", issuanceRoutes);

// ✅ Health endpoint for Kubernetes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

// ✅ Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on the server.",
  });
});

// ✅ Start server
app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 Issuance service running at http://${HOST}:${PORT}`);
});
