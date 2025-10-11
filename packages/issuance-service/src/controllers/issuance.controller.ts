import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid"; // <-- Add this line at the top
import { readDatabase, writeDatabase } from "../services/database.service";

export const issueCredential = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(
    `[${new Date().toISOString()}] Received request to issue credential.`
  );
  try {
    const { userId, credentialType, claims } = req.body;

    if (!userId || !credentialType || !claims) {
      return res
        .status(400)
        .json({ error: "userId, credentialType, and claims are required." });
    }

    const credential = {
      id: uuidv4(),
      issuer: "did:example:123456789abcdefghi",
      issuanceDate: new Date().toISOString(),
      type: ["VerifiableCredential", credentialType],
      credentialSubject: {
        id: userId,
        ...claims,
      },
    };

    const db = await readDatabase();
    const isDuplicate = db.some(
      (record) =>
        JSON.stringify(record.credential.credentialSubject) ===
        JSON.stringify(credential.credentialSubject)
    );

    if (isDuplicate) {
      return res
        .status(409)
        .json({ message: "A credential with these claims already exists." });
    }

    const workerId = process.env.HOSTNAME || "local-dev-worker";
    const newRecord = {
      credential,
      issuedBy: workerId,
      issuedAt: new Date().toISOString(),
    };

    const signedCredential = Buffer.from(JSON.stringify(credential)).toString(
      "base64"
    );

    db.push(newRecord);
    await writeDatabase(db);

    return res.status(201).json({
      message: `Credential issued by ${workerId}`,
      signedCredential,
      workerId,
    });
  } catch (error) {
    next(error);
  }
};
