import fs from "fs/promises";
import path from "path";

async function merge() {
  const workspace = path.join(process.cwd(), "workspace");
  const partsDir = path.join(workspace, "parts");
  const outputFile = path.join(workspace, "merged.txt");

  let files = [];

  const args = process.argv.slice(2);
  const filesIndex = args.indexOf("--files");

  if (filesIndex !== -1) {
    if (!args[filesIndex + 1]) {
      throw new Error("FS operation failed");
    }
    files = args[filesIndex + 1].split(",");
  } else {
    const entries = await fs.readdir(partsDir, { recursive: true });
    files = entries.filter((f) => path.extname(f) === ".txt").sort();
    if (files.length === 0) {
      throw new Error("FS operation failed");
    }
  }

  let content = "";

  for (const file of files) {
    const fullPath = path.join(partsDir, file);
    try {
      const text = await fs.readFile(fullPath, "utf-8");
      content += text;
    } catch {
      throw new Error("FS operation failed");
    }
  }
  await fs.writeFile(outputFile, content);
  console.log("merged.txt successfully created!");
}

merge();
