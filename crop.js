const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const inputPath = 'public/images/logo_circular.png';
  
  if (!fs.existsSync(inputPath)) {
    console.error("Image not found");
    return;
  }

  // Get image dimensions
  const metadata = await sharp(inputPath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  const size = Math.min(width, height);

  // Create a circular SVG mask
  const circleSvg = `<svg width="${size}" height="${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
  </svg>`;

  try {
    const roundedImage = await sharp(inputPath)
      .resize(size, size)
      .composite([{
        input: Buffer.from(circleSvg),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer();

    // Overwrite the favicons
    fs.writeFileSync('public/icon.png', roundedImage);
    fs.writeFileSync('public/apple-icon.png', roundedImage);
    
    // Also overwrite the main logo files to transparent versions!
    fs.writeFileSync('public/images/logo_transparent.png', roundedImage);
    fs.writeFileSync('public/images/logo_circular.png', roundedImage);
    fs.writeFileSync('public/images/logo.png', roundedImage);
    
    console.log("Success! Images are now perfectly circular with transparent background.");
  } catch (error) {
    console.error("Error processing image:", error);
  }
}

processImage();
