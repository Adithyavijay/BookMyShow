import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

// Type definitions
interface ImageSizeConfig {
  width: number;
  height: number;
}

interface ImageSizes {
  [key: string]: ImageSizeConfig;
}

interface OutputPaths {
  [size: string]: string;
}

interface OptimizeImageResult {
  paths: OutputPaths;
  placeholder: string | null;
}

interface ProcessResults {
  [filename: string]: OutputPaths;
}

interface ProcessPlaceholders {
  [filename: string]: string;
}

// Configuration
const INPUT_DIR = 'image-uploads';
const OUTPUT_DIR = 'public/images/collections';
const PLACEHOLDER_DATA_FILE = 'src/utils/imagePlaceholders.ts';

// Image sizes configuration
const IMAGE_SIZES: ImageSizes = {
  large: { width: 1200, height: 800 },
  medium: { width: 800, height: 600 },
  thumb: { width: 400, height: 300 }
};

async function generateBlurPlaceholder(imagePath: string): Promise<string | null> {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: 'inside' })
      .toBuffer();
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error generating blur placeholder for ${imagePath}:`, error);
    return null;
  }
}

async function optimizeImage(inputPath: string, fileName: string): Promise<OptimizeImageResult | null> {
  const placeholders: ProcessPlaceholders = {};
  const outputPaths: OutputPaths = {};

  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Generate optimized versions for different sizes
    for (const [size, dimensions] of Object.entries(IMAGE_SIZES)) {
      const outputFileName = `${path.parse(fileName).name}-${size}.jpg`;
      const outputPath = path.join(OUTPUT_DIR, outputFileName);

      await sharp(inputPath)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(outputPath);

      outputPaths[size] = `/images/collections/${outputFileName}`;
    }

    // Generate blur placeholder
    const placeholder = await generateBlurPlaceholder(inputPath);
    placeholders[fileName] = placeholder || '';

    return {
      paths: outputPaths,
      placeholder
    };
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
    return null;
  }
}

async function processAllImages(): Promise<void> {
  try {
    const files = await fs.readdir(INPUT_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    const results: ProcessResults = {};
    const placeholders: ProcessPlaceholders = {};

    for (const file of imageFiles) {
      console.log(`Processing ${file}...`);
      const inputPath = path.join(INPUT_DIR, file);
      const result = await optimizeImage(inputPath, file);

      if (result) {
        results[file] = result.paths;
        placeholders[file] = result.placeholder || '';
      }
    }

    // Generate TypeScript file with image paths and placeholders
    const tsContent = `
// This file is auto-generated. Do not edit manually.

export const IMAGE_PATHS = ${JSON.stringify(results, null, 2)} as const;

export const IMAGE_PLACEHOLDERS = ${JSON.stringify(placeholders, null, 2)} as const;
`;

    await fs.writeFile(PLACEHOLDER_DATA_FILE, tsContent);

    console.log('Image optimization complete!');
    console.log('Generated image paths and placeholders saved to:', PLACEHOLDER_DATA_FILE);
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

// Run the script
processAllImages();