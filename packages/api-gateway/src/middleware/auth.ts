import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET: jwt.Secret = (process.env.JWT_SECRET ||
  "secret") as jwt.Secret;

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ error: "missing authorization header" });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ error: "invalid authorization format" });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    // attach to req for gateway-level usage
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
};

// Attach user as header for downstream services (JSON string)
export const attachUserHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  const user = req.user;
  if (user) {
    try {
      const safe = typeof user === "string" ? user : JSON.stringify(user);
      req.headers["x-user"] = safe as any;
    } catch (e) {
      // ignore
    }
  }
  next();
};
