import * as fs from "fs/promises";
import * as path from "path";
// Define the structure of a credential record
interface CredentialRecord {
  credential: any;
  issuedBy: string;
  issuedAt: string;
}

// The path to the shared credentials file.
// We need to go up three levels from 'src/services' to the root directory.
const dbPath = path.join(__dirname, "..", "..", "..", "credentials.json");

/**
 * Reads the credentials from the JSON database file.
 * @returns A promise that resolves to an array of credential records.
 */
export const readDatabase = async (): Promise<CredentialRecord[]> => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    // If the file doesn't exist, return an empty array.
    if (error.code === "ENOENT") {
      return [];
    }
    // For other errors, re-throw them.
    throw error;
  }
};
