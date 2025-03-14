// scripts/post-build-cleanup.js
const fs = require("fs");
const path = require("path");

console.log("Running post-build cleanup...");

// Remove root node_modules
const nodeModulesPath = path.join(__dirname, "..", "node_modules");
if (fs.existsSync(nodeModulesPath)) {
  console.log("Removing root node_modules directory...");
  try {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    console.log("Successfully removed root node_modules");
  } catch (error) {
    console.error("Error removing node_modules:", error);
  }
} else {
  console.log("Root node_modules not found");
}

console.log("Cleanup complete");
