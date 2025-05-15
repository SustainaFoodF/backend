// verify-mongoose-fix.js
const fs = require('fs');
const path = require('path');

const CHECKS = [
  { file: 'node_modules/mongoose/lib/collection.js', pattern: /require\(['"]\.\/connectionstate['"]\)/ },
  { file: 'node_modules/mongoose/lib/drivers/node-mongodb-native/index.js', pattern: /require\(['"]\.\/bulkWriteResult['"]\)/ }
];

let allChecksPassed = true;

CHECKS.forEach(({file, pattern}) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.match(pattern)) {
      console.error(`FAIL: Found unresolved case sensitivity in ${file}`);
      allChecksPassed = false;
    } else {
      console.log(`PASS: ${file} looks good`);
    }
  } else {
    console.error(`ERROR: File not found - ${file}`);
    allChecksPassed = false;
  }
});

if (!allChecksPassed) {
  console.error('Mongoose fixes verification failed!');
  process.exit(1);
}

console.log('All Mongoose case sensitivity fixes verified successfully');