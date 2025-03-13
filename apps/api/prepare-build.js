/* eslint-disable */

const fs = require('fs');
const path = require('path');

// Create directories
console.log('Creating necessary directories...');
fs.mkdirSync('node_modules/db/dist/queries', { recursive: true });

console.log('Creating empty modules for imports...');
// Create minimum files to satisfy imports
fs.writeFileSync(
  'node_modules/db/dist/queries/index.js',
  'module.exports = { findOrganizationById: () => {}, findUserById: () => {} };'
);

fs.writeFileSync(
  'node_modules/db/dist/index.js',
  'exports.User = { id: "", name: "" };\n' +
    'exports.Organization = { id: "", name: "" };\n' +
    'exports.createUser = () => {};\n' +
    'exports.createOrganization = () => {};\n'
);

console.log('Build preparation complete!');
