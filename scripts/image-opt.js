const fs = require('fs').promises;
const path = require('path');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

async function optimize() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('Module "sharp" not found. Run `npm install` first.');
    process.exit(1);
  }

  const imagesDir = path.resolve(__dirname, '..', 'assets', 'images');
  try {
    const files = await walk(imagesDir);
    const targets = files.filter(f => /\.(jpe?g|png)$/i.test(f));
    if (!targets.length) {
      console.log('No JPEG/PNG images found in', imagesDir);
      return;
    }

    for (const file of targets) {
      const ext = path.extname(file).toLowerCase();
      const base = file.slice(0, -ext.length);
      const outWebp = base + '.webp';
      try {
        const img = sharp(file);
        if (ext === '.png') {
          await img.webp({ quality: 80 }).toFile(outWebp);
        } else {
          await img.jpeg({ quality: 80 }).toFile(base + '-opt.jpg');
          await img.webp({ quality: 75 }).toFile(outWebp);
        }
        console.log('Optimized:', path.relative(process.cwd(), file));
      } catch (err) {
        console.warn('Failed optimize', file, err.message);
      }
    }
    console.log('Image optimization complete. Generated .webp (and -opt.jpg) files next to originals.');
  } catch (err) {
    console.error('Error scanning images:', err.message);
    process.exit(1);
  }
}

optimize();
