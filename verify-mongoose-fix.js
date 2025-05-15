// verify-mongoose-fix.js
const path = require('path');
const fs = require('fs');

const targetFile = path.join('node_modules', 'mongoose', 'lib', 'drivers', 'node-mongodb-native', 'index.js');

if (!fs.existsSync(targetFile)) {
  console.error('Mongoose files not found!');
  process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf8');
if (content.includes('require("./bulkWriteResult")')) {
  console.error('Mongoose fix was not properly applied!');
  process.exit(1);
}

console.log('Mongoose fix verified successfully');