import path from "path";
import fs from "fs/promises";

const dynamic = async () => {
  const pluginName = process.argv[2];

  if (!pluginName) {
    console.log("Plugin not found");
    process.exit(1);
  }

  const pluginPath = path.join(
    import.meta.dirname,
    "plugins",
    `${pluginName}.js`,
  );

  try {
    await fs.access(pluginPath);
    const plugin = await import(pluginPath);
    if (typeof plugin.run !== "function") {
      console.log("Plugin not found");
      process.exit(1);
    }
    console.log(plugin?.run());
  } catch (err) {
    console.log("Plugin not found");
    process.exit(1);
  }
};

await dynamic();
