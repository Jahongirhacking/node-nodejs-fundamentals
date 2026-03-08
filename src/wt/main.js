import { Worker } from "worker_threads";
import os from "os";
import fs from "fs/promises";
import path from "path";

const kWayMerge = (arrays) => {
  const pointers = new Array(arrays.length).fill(0);
  const result = [];

  while (true) {
    let minVal = Infinity;
    let minIndex = -1;
    for (let i = 0; i < arrays.length; i++) {
      if (pointers[i] < arrays[i].length && arrays[i][pointers[i]] < minVal) {
        minVal = arrays[i][pointers[i]];
        minIndex = i;
      }
    }
    if (minIndex === -1) break;
    result.push(minVal);
    pointers[minIndex]++;
  }

  return result;
};

const main = async () => {
  const dataPath = path.join(process.cwd(), "src/wt/data.json");
  const dataRaw = await fs.readFile(dataPath, "utf-8");
  const numbers = JSON.parse(dataRaw);
  const numCores = os.cpus().length;
  const chunkSize = Math.ceil(numbers.length / numCores);
  const chunks = [];

  for (let i = 0; i < numbers.length; i += chunkSize) {
    chunks.push(numbers.slice(i, i + chunkSize));
  }

  const sortedChunks = [];

  await Promise.all(
    chunks.map((chunk, index) => {
      return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(process.cwd(), "src/wt/worker.js"));
        worker.postMessage(chunk);
        worker.on("message", (sorted) => {
          sortedChunks[index] = sorted;
          resolve();
        });
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
      });
    }),
  );

  const finalSorted = kWayMerge(sortedChunks);
  console.log("Final sorted array:", finalSorted);
};

main();
