// fix-mongoose-completely.js
const fs = require('fs');
const path = require('path');

const FIXES = [
  { from: /require\("\.\/bulkWriteResult"\)/g, to: 'require("./BulkWriteResult")' },
  { from: /require\("\.\/connectionstate"\)/g, to: 'require("./connectionState")' },
  { from: /require\('\.\/bulkWriteResult'\)/g, to: "require('./BulkWriteResult')" },
  { from: /require\('\.\/connectionstate'\)/g, to: "require('./connectionState')" }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    FIXES.forEach(({from, to}) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
  } catch (err) {
    console.error(`Error fixing ${filePath}:`, err.message);
  }
  return false;
}

const FILES_TO_CHECK = [
  'node_modules/mongoose/lib/collection.js',
  'node_modules/mongoose/lib/drivers/node-mongodb-native/index.js',
  'node_modules/mongoose/lib/drivers/node-mongodb-native/collection.js',
  'node_modules/mongoose/lib/index.js'
];

let fixesApplied = 0;
FILES_TO_CHECK.forEach(file => {
  if (fs.existsSync(file)) {
    if (fixFile(file)) fixesApplied++;
  } else {
    console.warn(`File not found: ${file}`);
  }
});

console.log(`Applied ${fixesApplied} fixes to Mongoose files`);
if (fixesApplied === 0) {
  console.error('No fixes were applied - please check Mongoose version');
  process.exit(1);
}