import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyTokenMiddleware, attachUserHeader } from "./middleware/auth";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
// app.use(bodyParser.json());

// Public auth routes - proxy straight to auth-service
app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_URL || "http://localhost:4000",
    changeOrigin: true,
    pathRewrite: { "^/auth": "/auth" },
  })
);

// Protected routes: verify token then proxy
app.use(
  "/issuance",
  verifyTokenMiddleware,
  attachUserHeader,
  createProxyMiddleware({
    target: process.env.ISSUANCE_URL || "http://localhost:8081",
    changeOrigin: true,
    pathRewrite: { "^/issuance": "" },
  })
);

app.use(
  "/verification",
  verifyTokenMiddleware,
  attachUserHeader,
  createProxyMiddleware({
    target: process.env.VERIFICATION_URL || "http://localhost:8082",
    changeOrigin: true,
    pathRewrite: { "^/verification": "" },
  })
);

// health
app.get("/health", (req, res) =>
  res.json({ ok: true, service: "api-gateway" })
);

app.listen(PORT, () => {
  console.log(`API Gateway listening on ${PORT}`);
});
