const fs = require('fs');
const path = require('path');

// Target directory (adjust if needed)
const targetDir = './src';

// Process all .js/.ts/.tsx files
const processFiles = (dir) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processFiles(filePath); // Recursively process subdirectories
    } 
    else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Replace standard imports with dynamic imports
      
      // Add 'next/dynamic' import if missing
      if (!content.includes("from 'next/dynamic'") && content.includes('dynamic(() => import')) {
        content = "import dynamic from 'next/dynamic';\n" + content;
      }

      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  });
};

processFiles(targetDir);
console.log('Dynamic imports added successfully!');