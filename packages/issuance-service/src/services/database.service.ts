import fs from "fs/promises";
import path from "path";

// --- Database Path Configuration ---
// Prefer /var/data in Kubernetes (persistent volume), else use local 'data' folder.
const dataDir = process.env.DB_PATH || "/usr/src/app/shared";
const dbPath = path.join(dataDir, "credentials.json");

console.log(`[DB] Using database location: ${dbPath}`);

interface CredentialRecord {
  credential: any;
  issuedBy: string;
  issuedAt: string;
}

// --- Ensure Data Directory Exists ---
const ensureDataDirExists = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error("[DB] Failed to ensure data directory:", error);
  }
};

// --- Read the Database File ---
export const readDatabase = async (): Promise<CredentialRecord[]> => {
  await ensureDataDirExists();
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log("[DB] No existing credentials.json found. Creating new one.");
      return [];
    }
    console.error("[DB] Error reading database:", error);
    throw error;
  }
};

// --- Write to the Database File ---
export const writeDatabase = async (
  records: CredentialRecord[]
): Promise<void> => {
  await ensureDataDirExists();
  try {
    await fs.writeFile(dbPath, JSON.stringify(records, null, 2), "utf-8");
    console.log(`[DB] Saved ${records.length} credential(s)`);
    console.log(`[DB] Location: ${dbPath}`);
  } catch (error) {
    console.error("[DB] Error writing database:", error);
  }
};

// --- Get All Credentials ---
export const getAllCredentials = async (): Promise<CredentialRecord[]> => {
  return await readDatabase();
};

// --- Export Unified Service ---
export const dbService = {
  read: readDatabase,
  write: writeDatabase,
  getAll: getAllCredentials,
};
