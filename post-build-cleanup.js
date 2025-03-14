// scripts/list-files.js
const fs = require("fs");
const path = require("path");

console.log("Listing files in project root:");
const rootDir = path.join(__dirname, "..");

try {
  const files = fs.readdirSync(rootDir);
  console.log(`Found ${files.length} items in root directory:`);

  files.forEach((file) => {
    const filePath = path.join(rootDir, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${stats.isDirectory() ? "directory" : "file"})`);
  });
} catch (error) {
  console.error("Error listing files:", error);
}

// Check specifically for node_modules
const nodeModulesPath = path.join(rootDir, "node_modules");
console.log(`\nChecking for node_modules at: ${nodeModulesPath}`);
if (fs.existsSync(nodeModulesPath)) {
  console.log("node_modules EXISTS in root");
} else {
  console.log("node_modules NOT FOUND in root");
}

// Show current working directory
console.log(`\nCurrent working directory: ${process.cwd()}`);
