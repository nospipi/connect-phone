/* eslint-disable */

const fs = require('fs');
const path = require('path');

// Read the package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Replace the token placeholder with the actual token
const githubToken = process.env.GITHUB_TOKEN;
if (githubToken) {
  const dbDependency = packageJson.dependencies['@nospipi/database'];
  if (dbDependency && dbDependency.includes('${GITHUB_TOKEN}')) {
    packageJson.dependencies['@nospipi/database'] = dbDependency.replace(
      '${GITHUB_TOKEN}',
      githubToken
    );

    // Write the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with GitHub token');
  }
}
