import { spawn } from "child_process";

const execCommand = () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Please provide a command to execute.");
    process.exit(1);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  const child = spawn(command, commandArgs, {
    stdio: "inherit",
    env: process.env,
    shell: true,
  });

  child.on("exit", (code) => {
    process.exit(code);
  });

  child.on("error", (err) => {
    console.error("Failed to start child process:", err);
    process.exit(1);
  });
};

execCommand();
