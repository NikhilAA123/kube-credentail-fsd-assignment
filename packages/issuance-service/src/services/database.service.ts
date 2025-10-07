import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(__dirname, "..", "..", "data", "credentials.json");

export const readDatabase = async (): Promise<any[]> => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const writeDatabase = async (data: any[]): Promise<void> => {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};
