import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const snapshot = async () => {
  const root = process.cwd();
  const files = await fs.readdir(process.cwd(), {
    recursive: true,
    withFileTypes: true,
  });
  const entries = await Promise.all(
    files?.map(async (file) => {
      const fullPath = path.join(file?.parentPath, file?.name);
      const fileStat = await fs.stat(fullPath);
      let fileContent = "";
      try {
        if (file?.isFile()) {
          fileContent = await fs.readFile(fullPath);
        }
      } catch (err) {
        console.error("Cannot read file:", fullPath, err.message);
      }

      return {
        path: path.relative(root, fullPath),
        type: file?.isFile() ? "file" : "directory",
        ...(file?.isFile()
          ? {
              size: fileStat.size,
              content: fileContent ? fileContent.toString("base64") : "",
            }
          : {}),
      };
    }),
  );
  fs.writeFile(
    "./snapshot.json",
    JSON.stringify(
      {
        rootPath: root,
        entries,
      },
      null,
      2,
    ),
    "utf-8",
  );
  console.log("snapshot.json is created successfully!");
};

await snapshot();
