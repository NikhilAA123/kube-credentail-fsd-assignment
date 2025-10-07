import { Request, Response, NextFunction } from "express";
import { readDatabase, writeDatabase } from "../services/database.service";

export const issueCredential = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Credential data is required." });
    }

    const db = await readDatabase();
    const isDuplicate = db.some(
      (record) =>
        JSON.stringify(record.credential) === JSON.stringify(credential)
    );

    if (isDuplicate) {
      return res
        .status(409)
        .json({ message: "This credential has already been issued." });
    }

    const workerId = process.env.HOSTNAME || "local-dev-worker";
    const newRecord = {
      credential,
      issuedBy: workerId,
      issuedAt: new Date().toISOString(),
    };

    db.push(newRecord);
    await writeDatabase(db);
    return res
      .status(201)
      .json({ message: `credential issued by ${workerId}` });
  } catch (error) {
    next(error);
  }
};
