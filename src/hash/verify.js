import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

async function hashFile(filePath) {
  const hash = crypto.createHash("sha256");
  return new Promise((resolve) => {
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => resolve(null));
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

const verify = async () => {
  const jsonPath = path.join(process.cwd(), "checksums.json");

  try {
    await fs.access(jsonPath);
  } catch {
    throw new Error("FS operation failed");
  }

  const data = await fs.readFile(jsonPath, "utf-8");
  const checksums = JSON.parse(data);

  for (const [file, expectedHash] of Object.entries(checksums)) {
    const filePath = path.join(process.cwd(), file);
    const actualHash = await hashFile(filePath);
    if (!actualHash) {
      console.log(`${file} — FAIL`);
    } else {
      console.log(`${file} — ${actualHash === expectedHash ? "OK" : "FAIL"}`);
    }
  }
};

await verify();
