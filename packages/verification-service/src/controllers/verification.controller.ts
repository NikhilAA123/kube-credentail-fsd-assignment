import { Request, Response, NextFunction } from "express";
import * as databaseService from "../services/database.service";

/**
 * Verifies a signed credential by decoding it and checking for its existence in the database.
 */
export const verifyCredentialController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Read the 'signedCredential' from the request body.
    const { signedCredential } = req.body;

    // 2. Validate the input.
    if (!signedCredential) {
      return res.status(400).json({ error: "signedCredential is required." });
    }

    // 3. Decode the Base64 string to get the original credential object.
    const decodedCredential = JSON.parse(
      Buffer.from(signedCredential, "base64").toString("utf-8")
    );

    // 4. Read the database.
    const db = await databaseService.readDatabase();

    // 5. Find the matching credential in the database by its unique ID.
    // This is more reliable than comparing the entire object.
    const foundRecord = db.find(
      (record) => record.credential.id === decodedCredential.id
    );

    // 6. Respond based on whether a record was found.
    if (foundRecord) {
      // If found, return a success response in the format the frontend expects.
      return res.status(200).json({
        isValid: true,
        message: "Credential is valid and has been issued.",
        details: {
          issuedBy: foundRecord.issuedBy,
          issuedAt: foundRecord.issuedAt,
        },
      });
    } else {
      // If not found, return a failure response in the format the frontend expects.
      return res.status(404).json({
        isValid: false,
        message: "Credential not found. It has not been issued or is invalid.",
      });
    }
  } catch (error) {
    // Pass any errors to the central error handler.
    next(error);
  }
};
