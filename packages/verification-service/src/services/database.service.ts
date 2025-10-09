import fs from "fs/promises";
import path from "path";

const dataDir = "/usr/src/app/data"; //  shared volume location
const dbPath = path.join(dataDir, "credentials.json");

interface CredentialRecord {
  credential: any;
  issuedBy: string;
  issuedAt: string;
}

const ensureDataDirExists = async () => {
  console.log(`[DB] Ensuring data directory exists at: ${dataDir}`);
  await fs.mkdir(dataDir, { recursive: true });
};

export const readDatabase = async (): Promise<CredentialRecord[]> => {
  await ensureDataDirExists();

  try {
    console.log(`[DB] Reading database file at: ${dbPath}`);
    const data = await fs.readFile(dbPath, "utf-8");
    console.log(`[DB] Raw data read: ${data}`);
    const parsedData = JSON.parse(data);
    console.log(`[DB] Parsed data length: ${parsedData.length}`);
    return parsedData;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log(`[DB] Database file not found, returning empty array.`);
      return [];
    }
    console.error(`[DB] Error reading database:`, error);
    throw error;
  }
};

export const writeDatabase = async (records: CredentialRecord[]) => {
  await ensureDataDirExists();
  console.log(`[DB] Writing ${records.length} record(s) to: ${dbPath}`);
  try {
    await fs.writeFile(dbPath, JSON.stringify(records, null, 2), "utf-8");
    console.log(`[DB] Successfully wrote to database.`);
  } catch (error) {
    console.error(`[DB] Error writing database:`, error);
    throw error;
  }
};
