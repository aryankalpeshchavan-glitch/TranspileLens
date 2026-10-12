import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to this script
const rootResultsPath = path.resolve(__dirname, '../../results.json');
const publicResultsPath = path.resolve(__dirname, '../public/results.json');

try {
  if (!fs.existsSync(rootResultsPath)) {
    console.error(`\n❌ Error: Source file not found at ${rootResultsPath}`);
    console.error(`Ensure the Python runner has successfully executed and generated results.json before syncing.\n`);
    process.exit(1);
  }

  // Ensure public directory exists
  const publicDir = path.dirname(publicResultsPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const data = fs.readFileSync(rootResultsPath, 'utf8');
  if (!data || data.trim() === '') {
    console.error(`\n❌ Error: Source results.json is empty. Aborting sync.\n`);
    process.exit(1);
  }

  fs.writeFileSync(publicResultsPath, data, 'utf8');
  console.log(`\n✅ Success: Synchronised results.json to frontend/public/results.json\n`);
  
} catch (error) {
  console.error(`\n❌ Error during synchronisation: ${error.message}\n`);
  process.exit(1);
}
