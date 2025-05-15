// fix-mongoose-completely.js
const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixed = content
    .replace(/require\("\.\/bulkWriteResult"\)/g, 'require("./BulkWriteResult")')
    .replace(/require\('\.\/bulkWriteResult'\)/g, "require('./BulkWriteResult')");
  fs.writeFileSync(filePath, fixed);
}

const filesToFix = [
  path.join('node_modules', 'mongoose', 'lib', 'drivers', 'node-mongodb-native', 'index.js'),
  path.join('node_modules', 'mongoose', 'lib', 'drivers', 'node-mongodb-native', 'collection.js')
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    fixFile(file);
    console.log(`Fixed ${file}`);
  } else {
    console.error(`File not found: ${file}`);
  }
});

console.log('Mongoose completely fixed');