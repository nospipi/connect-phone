// apps/api/create-service.js
const fs = require('fs');
const path = require('path');

// Utility functions
function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Template generators
function generateServiceTemplate(resourceName, serviceName) {
  return `// apps/api/src/resources/${resourceName}/services/${serviceName}/service.ts
`;
}

function generateControllerTemplate(resourceName, serviceName) {
  return `// apps/api/src/resources/${resourceName}/services/${serviceName}/controller.ts
`;
}

function generateSpecTemplate(resourceName, serviceName) {
  return `// apps/api/src/resources/${resourceName}/services/${serviceName}/service.spec.ts
`;
}

// Main function
function createService() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error(
      'Usage: npm run create-service <resource-name> <service-name>'
    );
    console.error('Example: npm run create-service users delete-user');
    process.exit(1);
  }

  const [resourceName, serviceName] = args;

  // Validate inputs
  if (!resourceName || !serviceName) {
    console.error('Both resource-name and service-name are required');
    process.exit(1);
  }

  // Create directory path
  const servicesDir = path.join(
    __dirname,
    'src',
    'resources',
    resourceName,
    'services',
    serviceName
  );

  // Check if directory already exists
  if (fs.existsSync(servicesDir)) {
    console.error(`Service directory already exists: ${servicesDir}`);
    process.exit(1);
  }

  // Create directory
  fs.mkdirSync(servicesDir, { recursive: true });
  console.log(`Created directory: ${servicesDir}`);

  // Generate and write files
  const files = [
    {
      name: 'service.ts',
      content: generateServiceTemplate(resourceName, serviceName),
    },
    {
      name: 'controller.ts',
      content: generateControllerTemplate(resourceName, serviceName),
    },
    {
      name: 'service.spec.ts',
      content: generateSpecTemplate(resourceName, serviceName),
    },
  ];

  files.forEach((file) => {
    const filePath = path.join(servicesDir, file.name);
    fs.writeFileSync(filePath, file.content);
    console.log(`Created file: ${filePath}`);
  });

  console.log(
    `\\n✅ Service "${serviceName}" created successfully in resources/${resourceName}/services/`
  );
  console.log(`\\n📝 Three empty files created:`);
  console.log(`   • service.ts - Add your business logic here`);
  console.log(`   • controller.ts - Add your HTTP endpoints here`);
  console.log(`   • service.spec.ts - Add your unit tests here`);
  console.log(`\\n📝 Next steps:`);
  console.log(
    `1. Update the module file: src/resources/${resourceName}/${resourceName}.module.ts`
  );
  console.log(
    `2. Add the controller and service to the imports/providers arrays`
  );
  console.log(`3. Implement the actual business logic in the service`);
  console.log(`4. Add HTTP methods and routes in the controller`);
  console.log(`5. Write unit tests in the spec file`);
  console.log(`6. Add DTOs if needed for request/response validation`);
}

// Run the script
createService();

module.exports = {
  toPascalCase,
  toCamelCase,
  toKebabCase,
  generateServiceTemplate,
  generateControllerTemplate,
  generateSpecTemplate,
};
