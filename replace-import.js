const fs = require('fs');
const path = require('path');

// Path to the Result.tsx file
const filePath = path.join('src', 'app', '_ui', 'components', 'Result.tsx');

// Read the content of the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Option 1: Remove the duplicate definition
  // This replaces the local definition line and any empty lines after it
  const modifiedContent = data.replace(
    /\/\/ Utility to check if code is running in browser environment\s*\nconst isBrowser = \(\) => typeof window !== 'undefined';(\s*\n)*/g,
    ''
  );

  // Write the modified content back to the file
  fs.writeFile(filePath, modifiedContent, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file: ${err}`);
      return;
    }
    console.log(`Successfully fixed naming conflict in ${filePath}`);
  });
});