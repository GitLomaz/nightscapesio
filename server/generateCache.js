const fs = require("fs");
const path = require("path");

// Read all cache files
const cacheDir = "./cache";
const files = fs.readdirSync(cacheDir).filter(f => f.startsWith("sp-") && f.endsWith(".txt"));

const cacheData = {};

files.forEach(filename => {
  const filePath = path.join(cacheDir, filename);
  const content = fs.readFileSync(filePath, "utf8");
  
  // Parse filename: sp-{map}-{x}-{y}-{radius}.txt
  const key = filename.replace("sp-", "").replace(".txt", "");
  const parts = key.split("-");
  
  // Handle map names with hyphens (if any)
  const radius = parts[parts.length - 1];
  const y = parts[parts.length - 2];
  const x = parts[parts.length - 3];
  const map = parts.slice(0, parts.length - 3).join("-");
  
  const cacheKey = `${map}-${x}-${y}-${radius}`;
  
  try {
    cacheData[cacheKey] = JSON.parse(content);
  } catch (e) {
    console.error(`Error parsing ${filename}:`, e);
  }
});

// Generate JavaScript module
const output = `// Auto-generated cache data from server/cache/*.txt files
// Generated on ${new Date().toISOString()}
// Total entries: ${Object.keys(cacheData).length}

const CACHE = ${JSON.stringify(cacheData, null, 2)};

module.exports = CACHE;
`;

fs.writeFileSync("./classes/util/Cache.js", output);
console.log(`Generated Cache.js with ${Object.keys(cacheData).length} entries`);
