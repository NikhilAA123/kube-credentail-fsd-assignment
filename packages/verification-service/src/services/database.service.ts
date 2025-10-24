import fs from "fs/promises";
import path from "path";

// --- OLD local path ---
// const dataDir = process.env.DB_PATH || path.resolve(__dirname, "../../../../data");

// --- NEW Railway shared volume ---
const dataDir = process.env.DB_PATH || "/var/data";

const dbPath = path.join(dataDir, "credentials.json");

// Add a log to show which path is being used
console.log(`[DB] Attempting to read database from: ${dbPath}`);

interface CredentialRecord {
  credential: any;
  issuedBy: string;
  issuedAt: string;
}

export const readDatabase = async (): Promise<CredentialRecord[]> => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log("[DB] Database file not found.");
      return [];
    }
    console.error("[DB] CRITICAL: Error reading database file:", error);
    throw error;
  }
};
