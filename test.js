const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

(async () => {
  const tmpPath = path.resolve("./test-tmp");
  const pluginsJsonPath = path.resolve("./plugins.json");
  fs.rmSync(tmpPath, { recursive: true, force: true });
  fs.mkdirSync(tmpPath);
  const plugins = JSON.parse(fs.readFileSync(pluginsJsonPath));
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    if (plugin.repo === "bees-build") continue; // Can't be bothered validating these
    const response = await fetch(plugin.repo);
    const data = await response.json();
    let found = false;
    let gitRepo = "";
    for (let i = 0; i < data.length; i++) {
      if (data[i].InternalName == plugin.name) {
        if (!data[i].RepoUrl && !plugin.git) {
          console.error(`${plugin.name} is missing RepoUrl: ${plugin.repo}`);
          fs.rmSync(tmpPath, { recursive: true, force: true });
          process.exit(1);
        }
        gitRepo = data[i].RepoUrl ?? plugin.git;
        found = true;
        break;
      }
    }
    if (!found) {
      console.error(`${plugin.name} is missing from ${plugin.repo}`);
      fs.rmSync(tmpPath, { recursive: true, force: true });
      process.exit(1);
    }
    const pluginPath = path.resolve(tmpPath, plugin.name);
    execSync(`git clone --quiet ${gitRepo} ${pluginPath}`);
    const csprojPath = path.resolve(pluginPath, plugin.projectRoot, `${plugin.csprojName ?? plugin.name}.csproj`);
    if (!fs.existsSync(csprojPath)) {
      console.error(`${csprojPath} is missing from ${plugin.name}`);
      fs.rmSync(tmpPath, { recursive: true, force: true });
      process.exit(1);
    }
  }
  fs.rmSync(tmpPath, { recursive: true, force: true });

  plugins.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(pluginsJsonPath, JSON.stringify(plugins, null, 2));
})();
