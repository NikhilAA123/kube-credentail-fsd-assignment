import { Request, Response, NextFunction } from "express";
import * as databaseService from "../services/database.service";
import { isEqual } from "lodash"; // A helpful utility for deep object comparison

/**
 * Verifies if a given credential exists in the database.
 */
export const verifyCredential = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credential } = req.body;

    // 1. Validate input
    if (!credential) {
      return res.status(400).json({ error: "Credential data is required." });
    }

    // 2. Read the database
    const allCredentials = await databaseService.readDatabase();

    // 3. Find the matching credential
    const foundRecord = allCredentials.find((record) =>
      isEqual(record.credential, credential)
    );

    // 4. Respond based on the result
    if (foundRecord) {
      // If found, return a success message with the full record
      return res.status(200).json({
        message: "Credential verified successfully.",
        data: foundRecord,
      });
    } else {
      // If not found, return a 404
      return res.status(404).json({
        message: "Credential not found or has not been issued.",
      });
    }
  } catch (error) {
    next(error); // Pass errors to the central error handler
  }
};
