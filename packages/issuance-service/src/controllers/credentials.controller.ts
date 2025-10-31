import { Request, Response } from "express";
import { dbService } from "../services/database.service";

export const getAllCredentials = async (req: Request, res: Response) => {
  try {
    const credentials = await dbService.getAll(); // ✅ FIXED
    return res.json(credentials);
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return res.status(500).json({ error: "Failed to fetch credentials" });
  }
};
