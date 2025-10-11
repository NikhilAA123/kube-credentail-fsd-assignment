import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { readDatabase, writeDatabase } from "../services/database.service";
import { isEqual } from "lodash"; // We need this for deep comparison of claims

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

    // 1. Validate input
    if (!userId || !credentialType || !claims) {
      return res
        .status(400)
        .json({ error: "userId, credentialType, and claims are required." });
    }

    // 2. Read the database
    const db = await readDatabase();

    // --- This is the corrected duplicate check logic ---
    const isDuplicate = db.some(
      (record) =>
        record.credential.userId === userId &&
        record.credential.credentialType === credentialType &&
        isEqual(record.credential.claims, claims) // Deep compare claims object
    );

    if (isDuplicate) {
      return res
        .status(409)
        .json({ error: "This credential has already been issued." });
    }
    // --- End of corrected logic ---

    // 3. Construct the new Verifiable Credential
    const workerId = `worker-${Math.floor(Math.random() * 1000)}`;
    const newCredential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
      ],
      id: `http://example.edu/credentials/${uuidv4()}`,
      type: ["VerifiableCredential", credentialType],
      issuer: "did:example:123456789abcdefghi",
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: `did:example:ebfeb1f712ebc6f1c276e12ec21`,
        ...claims,
      },
      // Storing original request data for easier lookup
      userId,
      credentialType,
      claims,
    };

    // 4. Save to database
    const newRecord = {
      credential: newCredential,
      issuedBy: workerId,
      issuedAt: new Date().toISOString(),
    };
    db.push(newRecord);
    await writeDatabase(db);

    // 5. Respond with success
    const signedCredential = Buffer.from(
      JSON.stringify(newCredential)
    ).toString("base64");

    return res.status(201).json({
      message: `Credential issued by ${workerId}`,
      signedCredential,
      workerId,
    });
  } catch (error) {
    next(error);
  }
};
