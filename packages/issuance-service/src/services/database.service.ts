import fs from "fs/promises";
import path from "path";

const dataDir = "/usr/src/app/data"; // ✅ shared volume location
const dbPath = path.join(dataDir, "credentials.json");

interface CredentialRecord {
  credential: any;
  issuedBy: string;
  issuedAt: string;
}

// Ensures the data directory exists before any operation
const ensureDataDirExists = async () => {
  await fs.mkdir(dataDir, { recursive: true });
};

export const readDatabase = async (): Promise<CredentialRecord[]> => {
  await ensureDataDirExists();
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    // If the file doesn't exist, return an empty array
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

export const writeDatabase = async (
  records: CredentialRecord[]
): Promise<void> => {
  await ensureDataDirExists();
  await fs.writeFile(dbPath, JSON.stringify(records, null, 2), "utf-8");
  console.log(`[DB] Saved ${records.length} credential(s)`);
  console.log(`[DB] Location: ${dbPath}`);
};
