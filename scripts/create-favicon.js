const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFavicon() {
  const publicDir = path.join(__dirname, '..', 'public');
  const logoPath = path.join(publicDir, 'jabinweb_logo.png');
  
  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error('Logo file not found:', logoPath);
    return;
  }

  try {
    // Create favicon.ico (16x16 and 32x32)
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    await sharp(logoPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    // Create apple-touch-icon
    await sharp(logoPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Create different sizes for PWA
    const sizes = [192, 512];
    for (const size of sizes) {
      await sharp(logoPath)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
    }

    // Create favicon.ico from 32x32 version
    await sharp(path.join(publicDir, 'favicon-32x32.png'))
      .ico()
      .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('✅ All favicon files created successfully!');
    console.log('Created files:');
    console.log('- favicon.ico');
    console.log('- favicon-16x16.png');
    console.log('- favicon-32x32.png');
    console.log('- apple-touch-icon.png');
    console.log('- icon-192x192.png');
    console.log('- icon-512x512.png');

  } catch (error) {
    console.error('Error creating favicon files:', error);
  }
}

createFavicon();
