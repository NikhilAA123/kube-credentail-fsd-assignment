import fs from "fs/promises";
import path from "path";

// --- OLD local path ---
// const dataDir = process.env.DB_PATH || path.resolve(__dirname, "../../../../data");

// --- NEW Railway shared volume ---
const dataDir = process.env.DB_PATH || "/var/data";

const dbPath = path.join(dataDir, "credentials.json");

// Add a log to show which path is being used
console.log(`[DB] Using database location: ${dbPath}`);

interface CredentialRecord {
  credential: any;
  issuedBy: string;
  issuedAt: string;
}

const ensureDataDirExists = async () => {
  // Only create the directory if we are using the local path
  if (!process.env.DB_PATH) {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

export const readDatabase = async (): Promise<CredentialRecord[]> => {
  await ensureDataDirExists();
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
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
