// scripts/post-build-cleanup.js
const fs = require("fs");
const path = require("path");

console.log("Running post-build cleanup...");
console.log(`Current working directory: ${process.cwd()}`);

// Use current working directory instead of relative path
const nodeModulesPath = path.join(process.cwd(), "node_modules");
console.log(`Looking for node_modules at: ${nodeModulesPath}`);

if (fs.existsSync(nodeModulesPath)) {
  console.log("Found node_modules, removing it...");
  try {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    console.log("Successfully removed node_modules");
  } catch (error) {
    console.error("Error removing node_modules:", error);
  }
} else {
  console.log("node_modules not found at this location");
}

console.log("Cleanup complete");
