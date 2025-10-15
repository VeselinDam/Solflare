import { promises as fs } from "fs";
import * as path from 'path';

/**
 * Saves a JSON response to the artifacts/apiResponses folder.
 * @param label The base name of the file without extension (e.g., "mainnet-1")
 * @param data The JSON data to be saved
 * @returns The full path to the saved file
 */
export async function saveResponse(label: string, data: unknown): Promise<string> {
  const dir = path.resolve(process.cwd(), "artifacts/apiResponses");
  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, `${label}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  return filePath;
}
