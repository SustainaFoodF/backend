// fix-mongoose.js
const fs = require('fs');
const path = require('path');

function fixMongooseCase(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixMongooseCase(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/require\("\.\/bulkWriteResult"\)/g, 'require("./BulkWriteResult")');
      fs.writeFileSync(fullPath, content);
    }
  });
}

// Fix both the main mongoose directory and the node-mongodb-native driver
fixMongooseCase(path.join(__dirname, 'node_modules', 'mongoose', 'lib'));
fixMongooseCase(path.join(__dirname, 'node_modules', 'mongoose', 'lib', 'drivers', 'node-mongodb-native'));

console.log('Mongoose case sensitivity fixes applied successfully');