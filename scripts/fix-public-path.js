const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const REPLACEMENTS = [
  { from: '"/aiDrivenMovable.jpeg"', to: '"/MovableType/aiDrivenMovable.jpeg"' },
  { from: '"/woodblockToMovabletype.jpeg"', to: '"/MovableType/woodblockToMovabletype.jpeg"' },
  { from: '"/logo.svg"', to: '"/MovableType/logo.svg"' },
];

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.js'))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const { from, to } of REPLACEMENTS) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

if (fs.existsSync(docsDir)) {
  processDir(docsDir);
  console.log('[fix-public-path] HTML paths patched for /MovableType');
} else {
  console.warn('[fix-public-path] docs/ dir not found, skipped');
}
