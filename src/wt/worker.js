import { parentPort } from "worker_threads";

if (!parentPort) throw new Error("This script must be run as a worker");

parentPort.on("message", (data) => {
  const sorted = data.slice().sort((a, b) => a - b);
  parentPort.postMessage(sorted);
});
